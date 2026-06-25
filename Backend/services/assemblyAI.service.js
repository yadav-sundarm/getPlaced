import { AssemblyAI } from "assemblyai";

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY,
});

export async function transcribeAudio(audioPath) {
  try {
    const transcript = await client.transcripts.transcribe({
      audio: audioPath,

      speech_models: ["universal-2"],

      sentiment_analysis: true,

      disfluencies: true,

      punctuate: true,

      format_text: true,
    });

    const words = Array.isArray(transcript.words) ? transcript.words : [];

    const sentiments = Array.isArray(transcript.sentiment_analysis_results)
      ? transcript.sentiment_analysis_results
      : [];

    const transcriptText = transcript.text || "";

    const confidence =
      typeof transcript.confidence === "number" ? transcript.confidence : 0;

    // =====================================
    // FILLER WORDS
    // =====================================
    const fillerPatterns = [
      "um",
      "umm",
      "uh",
      "uhh",
      "ah",
      "hmm",
      "like",
      "you know",
      "basically",
      "actually",
      "so",
      "okay",
      "right",
      "well",
    ];

    let fillerCount = 0;

    words.forEach((word) => {
      const wordText = (word?.text || "")
        .toLowerCase()
        .replace(/[.,!?]/g, "")
        .trim();

      if (fillerPatterns.some((filler) => wordText === filler)) {
        fillerCount++;
      }
    });

    // =====================================
    // AUDIO DURATION
    // =====================================
    const audioDuration =
      typeof transcript.audio_duration === "number"
        ? transcript.audio_duration
        : 0;

    // AssemblyAI gives seconds
    const audioDurationMinutes = audioDuration > 0 ? audioDuration / 60 : 1;

    // =====================================
    // SPEAKING RATE
    // =====================================
    const totalWords = words.filter((w) => w?.text).length;

    const wordsPerMinute = Math.max(
      1,
      Math.round(totalWords / audioDurationMinutes),
    );

    console.log("AUDIO DURATION:", audioDuration);

    console.log("TOTAL WORDS:", totalWords);

    console.log("WORDS PER MINUTE:", wordsPerMinute);

    // =====================================
    // PAUSE ANALYSIS
    // =====================================
    let longPauseCount = 0;

    for (let i = 1; i < words.length; i++) {
      const previousEnd =
        typeof words[i - 1]?.end === "number" ? words[i - 1].end : 0;

      const currentStart =
        typeof words[i]?.start === "number" ? words[i].start : 0;

      const gap = currentStart - previousEnd;

      if (gap > 1500) {
        longPauseCount++;
      }
    }

    // =====================================
    // SENTIMENT ANALYSIS
    // =====================================
    let positiveCount = 0;

    let negativeCount = 0;

    sentiments.forEach((s) => {
      if (s?.sentiment === "POSITIVE") {
        positiveCount++;
      }

      if (s?.sentiment === "NEGATIVE") {
        negativeCount++;
      }
    });

    // =====================================
    // FLUENCY SCORE
    // =====================================
    let fluencyScore = 10;

    fluencyScore -= fillerCount * 0.2;

    fluencyScore -= longPauseCount * 0.3;

    if (wordsPerMinute < 90) {
      fluencyScore -= 1;
    }

    if (wordsPerMinute > 170) {
      fluencyScore -= 1;
    }

    fluencyScore = Math.max(1, Math.min(10, Number(fluencyScore.toFixed(1))));

    // =====================================
    // SPEAKING PACE
    // =====================================
    let speakingPace = "Balanced";

    if (wordsPerMinute < 90) {
      speakingPace = "Too Slow";
    } else if (wordsPerMinute > 170) {
      speakingPace = "Too Fast";
    }

    return {
      text: transcriptText,

      confidence,

      fillerCount,

      longPauseCount,

      wordsPerMinute,

      speakingPace,

      fluencyScore,

      positiveSentiment: positiveCount,

      negativeSentiment: negativeCount,

      audioDuration,
    };
  } catch (error) {
    console.error("===== ASSEMBLY AI ERROR =====");

    console.error(error.message);

    throw new Error("Audio transcription failed");
  }
}
