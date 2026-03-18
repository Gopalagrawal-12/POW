import { useState, useRef } from "react";

const API_URL = "https://gopalgoyal12-voice-detection-api.hf.space/detect";

const AUDIO_FORMATS = ["wav", "mp3", "ogg", "flac", "m4a", "webm"];
const LANGUAGES = ["hindi", "tamil", "telugu", "english", "malayalam"];

export default function VoiceDetection() {
  const [apiKey, setApiKey] = useState("");
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [audioFormat, setAudioFormat] = useState(AUDIO_FORMATS[0]);
  const [audioBase64, setAudioBase64] = useState("");
  const [fileName, setFileName] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    // Derive audio format from file extension
    const ext = file.name.split(".").pop().toLowerCase();
    if (AUDIO_FORMATS.includes(ext)) {
      setAudioFormat(ext);
    }

    const reader = new FileReader();
    reader.onload = () => {
      // Strip the data URL prefix (e.g. "data:audio/wav;base64,") to get raw base64
      const result = reader.result;
      const commaIndex = typeof result === "string" ? result.indexOf(",") : -1;
      if (commaIndex === -1) {
        setError("Failed to encode the audio file. Please try a different file.");
        return;
      }
      setAudioBase64(result.slice(commaIndex + 1));
    };
    reader.onerror = () => {
      setError("Failed to read the audio file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!apiKey.trim()) {
      setError("Please enter your API security key.");
      return;
    }
    if (!audioBase64) {
      setError("Please select an audio file.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey.trim(),
        },
        body: JSON.stringify({ language, audioFormat, audioBase64 }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(
          errData?.detail ||
            errData?.message ||
            `Request failed with status ${response.status}`
        );
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setApiKey("");
    setLanguage(LANGUAGES[0]);
    setAudioFormat(AUDIO_FORMATS[0]);
    setAudioBase64("");
    setFileName("");
    setResult(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🎙️ Voice Detection</h1>
        <p style={styles.subtitle}>
          Detect whether an audio clip is AI-generated and identify its language.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* API Key */}
          <div style={styles.field}>
            <label style={styles.label} htmlFor="apiKey">
              API Security Key
            </label>
            <input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
              style={styles.input}
              autoComplete="off"
            />
          </div>

          {/* Language */}
          <div style={styles.field}>
            <label style={styles.label} htmlFor="language">
              Language
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={styles.select}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Audio Format */}
          <div style={styles.field}>
            <label style={styles.label} htmlFor="audioFormat">
              Audio Format
            </label>
            <select
              id="audioFormat"
              value={audioFormat}
              onChange={(e) => setAudioFormat(e.target.value)}
              style={styles.select}
            >
              {AUDIO_FORMATS.map((fmt) => (
                <option key={fmt} value={fmt}>
                  {fmt.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Audio File */}
          <div style={styles.field}>
            <label style={styles.label} htmlFor="audioFile">
              Audio File
            </label>
            <input
              id="audioFile"
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              style={styles.fileInput}
            />
            {fileName && (
              <p style={styles.fileName}>📄 {fileName}</p>
            )}
          </div>

          {/* Error */}
          {error && <p style={styles.error}>⚠️ {error}</p>}

          {/* Actions */}
          <div style={styles.actions}>
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.button,
                ...(loading ? styles.buttonDisabled : {}),
              }}
            >
              {loading ? "Analyzing…" : "Analyze Audio"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              style={styles.resetButton}
            >
              Reset
            </button>
          </div>
        </form>

        {/* Result */}
        {result && (
          <div style={styles.resultCard}>
            <h2 style={styles.resultTitle}>Analysis Result</h2>
            <div style={styles.resultRow}>
              <span style={styles.resultLabel}>AI Generated:</span>
              <span
                style={{
                  ...styles.resultValue,
                  color: result.isAiGenerated ? "#e53e3e" : "#38a169",
                  fontWeight: "700",
                }}
              >
                {result.isAiGenerated ? "Yes ⚠️" : "No ✅"}
              </span>
            </div>
            <div style={styles.resultRow}>
              <span style={styles.resultLabel}>Detected Language:</span>
              <span style={styles.resultValue}>
                {result.detectedLanguage
                  ? result.detectedLanguage.charAt(0).toUpperCase() +
                    result.detectedLanguage.slice(1)
                  : "—"}
              </span>
            </div>
            {result.confidence != null && (
              <div style={styles.resultRow}>
                <span style={styles.resultLabel}>Confidence:</span>
                <span style={styles.resultValue}>
                  {(result.confidence * 100).toFixed(1)}%
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f4f8",
    padding: "24px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
    padding: "40px",
    width: "100%",
    maxWidth: "480px",
  },
  title: {
    margin: "0 0 8px",
    fontSize: "26px",
    fontWeight: "700",
    color: "#1a202c",
    textAlign: "center",
  },
  subtitle: {
    margin: "0 0 28px",
    fontSize: "14px",
    color: "#718096",
    textAlign: "center",
    lineHeight: "1.5",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#4a5568",
  },
  input: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #cbd5e0",
    fontSize: "14px",
    color: "#2d3748",
    outline: "none",
    transition: "border-color 0.2s",
  },
  select: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #cbd5e0",
    fontSize: "14px",
    color: "#2d3748",
    backgroundColor: "#fff",
    outline: "none",
    cursor: "pointer",
  },
  fileInput: {
    fontSize: "14px",
    color: "#4a5568",
    cursor: "pointer",
  },
  fileName: {
    margin: "4px 0 0",
    fontSize: "13px",
    color: "#718096",
  },
  error: {
    margin: "0",
    padding: "10px 14px",
    backgroundColor: "#fff5f5",
    border: "1px solid #fed7d7",
    borderRadius: "8px",
    color: "#c53030",
    fontSize: "13px",
  },
  actions: {
    display: "flex",
    gap: "12px",
    marginTop: "4px",
  },
  button: {
    flex: 1,
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#4c51bf",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  buttonDisabled: {
    backgroundColor: "#a0aec0",
    cursor: "not-allowed",
  },
  resetButton: {
    padding: "12px 20px",
    borderRadius: "8px",
    border: "1px solid #cbd5e0",
    backgroundColor: "#fff",
    color: "#4a5568",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  },
  resultCard: {
    marginTop: "28px",
    padding: "20px",
    backgroundColor: "#f7fafc",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
  },
  resultTitle: {
    margin: "0 0 16px",
    fontSize: "16px",
    fontWeight: "700",
    color: "#2d3748",
  },
  resultRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
    borderBottom: "1px solid #e2e8f0",
  },
  resultLabel: {
    fontSize: "14px",
    color: "#718096",
  },
  resultValue: {
    fontSize: "14px",
    color: "#2d3748",
    fontWeight: "600",
  },
};
