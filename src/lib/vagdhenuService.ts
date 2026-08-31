import { Client } from '@gradio/client';

export interface VagdhenuChantRequest {
  text: string;
  meter?: string;
  seed?: number;
}

export interface VagdhenuChantResult {
  audioBuffer: Buffer;
  detectedMeter: string;
  statusText?: string;
}

const HF_SPACE_DEFAULT = 'prathoshap/vagdhenu-demo';

/**
 * Maps input meter option to the Gradio Space parameter value.
 */
export function mapMeterToHFSyntax(meter?: string): string {
  if (!meter || meter === 'AUTO' || meter === '__auto__') {
    return '__auto__';
  }
  return meter;
}

/**
 * Extracts detected meter name from Hugging Face markdown status response.
 */
export function parseDetectedMeterFromMarkdown(markdownText: string, defaultMeter: string): string {
  if (!markdownText) return defaultMeter;
  const match = markdownText.match(/(?:Meter|Detected meter|chanting with)\s*:\s*\*\*([^*]+)\*\*/i);
  if (match) {
    return match[1].trim();
  }
  return defaultMeter;
}

/**
 * Server-side abstraction to synthesize Sanskrit chant using Hugging Face Gradio Space (prathoshap/vagdhenu-demo).
 */
export async function generateVagdhenuChant(req: VagdhenuChantRequest): Promise<VagdhenuChantResult> {
  const { text, meter = 'AUTO', seed = 60 } = req;

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    throw new Error('Verse text is required');
  }

  const space = process.env.VAGDHENU_HF_SPACE || HF_SPACE_DEFAULT;
  const token = process.env.VAGDHENU_HF_TOKEN?.trim();

  const clientOptions = token ? { hf_token: token as `hf_${string}` } : {};
  const meterChoice = mapMeterToHFSyntax(meter);
  const numericSeed = parseInt(String(seed), 10) || 60;

  console.log(`[Vāgdhenu HF] Connecting to Space "${space}"...`);

  let client: any;
  try {
    client = await Client.connect(space, clientOptions);
  } catch (connectErr: any) {
    console.error(`[Vāgdhenu HF] Connection error to "${space}":`, connectErr?.message || connectErr);
    throw new Error(`Unable to connect to Hugging Face Vāgdhenu Space (${space}). Please verify space status and configuration.`);
  }

  console.log(`[Vāgdhenu HF] Submitting verse to /synthesize...`);

  // Timeout handler for queued ZeroGPU jobs (120 seconds max)
  const timeoutMs = 120000;
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error('Vāgdhenu chant generation timed out. The Hugging Face queue may be busy. Please try again.'));
    }, timeoutMs);
  });

  try {
    const predictPromise = client.predict('/synthesize', {
      text: text.trim(),
      meter_choice: meterChoice,
      seed: numericSeed,
    });

    const result = (await Promise.race([predictPromise, timeoutPromise])) as any;

    if (!result || !result.data || !Array.isArray(result.data) || result.data.length === 0) {
      throw new Error('Malformed or empty response from Hugging Face Vāgdhenu Space.');
    }

    const audioOutput = result.data[0];
    const statusMarkdown = typeof result.data[1] === 'string' ? result.data[1] : '';

    let audioUrl: string | undefined;
    if (typeof audioOutput === 'string') {
      audioUrl = audioOutput;
    } else if (audioOutput && typeof audioOutput === 'object') {
      audioUrl = audioOutput.url || audioOutput.path;
    }

    if (!audioUrl) {
      throw new Error('No audio output URL returned from Hugging Face Vāgdhenu Space.');
    }

    // Resolve relative URLs to complete space URL if needed
    if (audioUrl.startsWith('/')) {
      const spaceHost = space.replace('/', '-').toLowerCase();
      audioUrl = `https://${spaceHost}.hf.space${audioUrl}`;
    }

    console.log(`[Vāgdhenu HF] Fetching generated audio file...`);

    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const audioResponse = await fetch(audioUrl, { headers });
    if (!audioResponse.ok) {
      throw new Error(`Failed to retrieve generated audio file from Hugging Face (HTTP ${audioResponse.status})`);
    }

    const arrayBuffer = await audioResponse.arrayBuffer();
    const audioBuffer = Buffer.from(arrayBuffer);

    if (audioBuffer.length === 0) {
      throw new Error('Empty audio file received from Hugging Face Vāgdhenu Space.');
    }

    const detectedMeter = parseDetectedMeterFromMarkdown(statusMarkdown, meter !== 'AUTO' ? meter : 'anuṣṭubh');

    return {
      audioBuffer,
      detectedMeter,
      statusText: statusMarkdown,
    };
  } catch (err: any) {
    let rawMsg = err?.message || String(err);
    if (token) {
      rawMsg = rawMsg.replace(new RegExp(token, 'g'), '[REDACTED_TOKEN]');
    }
    console.error(`[Vāgdhenu HF] Synthesis error:`, rawMsg);
    throw new Error(rawMsg);
  }
}
