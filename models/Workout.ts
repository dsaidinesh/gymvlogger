import mongoose from 'mongoose';

const WorkoutSchema = new mongoose.Schema({
  day: { type: String, required: true },
  name: { type: String, required: true },
  sets: { type: Number, required: true },
  reps: { type: Number, required: true },
  weight: { type: Number, required: true },
});

export default mongoose.models.Workout || mongoose.model('Workout', WorkoutSchema);