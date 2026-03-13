export default function CreateForm({ file, setFile, manualMood, setManualMood }) {

  const moods = {
    happy: "😊 Happy",
    neutral: "😐 Neutral",
    sad: "😢 Sad",
    surprise: "😲 Surprise",
    angry: "😡 Angry",
  };

  return (
    <div className="w-3/5 flex flex-col items-center bg-white shadow-lg rounded-2xl p-6 gap-4">

      <h3 className="text-2xl font-semibold text-gray-700">
        Upload a Photo to Detect Mood
      </h3>

      <div className="w-64 h-64 border-2 border-dashed rounded-xl flex items-center justify-center bg-gray-100 overflow-hidden">
        {file ? (
          <img
            src={URL.createObjectURL(file)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-400">No photo selected</span>
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        className="w-full border rounded-lg p-1"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <h2 className="text-xl font-semibold mt-4 mb-2">Mood Info</h2>

      <div className="flex gap-6">
        {Object.entries(moods).map(([key, label]) => (
          <label key={key} className="flex items-center space-x-2">
            <input
              type="radio"
              value={key}
              checked={manualMood === key}
              onChange={(e) => setManualMood(e.target.value)}
            />
            <span>{label}</span>
          </label>
        ))}
      </div>

    </div>
  );
}