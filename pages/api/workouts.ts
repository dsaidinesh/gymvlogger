import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/mongodb';
import Workout from '../../models/Workout';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const workouts = await Workout.find({});
        res.status(200).json(workouts);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      try {
        const workout = await Workout.create(req.body);
        res.status(201).json({ success: true, data: workout });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'DELETE':
      try {
        const deletedWorkout = await Workout.deleteOne({ _id: req.body.id });
        if (deletedWorkout.deletedCount) {
          res.status(200).json({ success: true });
        } else {
          res.status(404).json({ success: false });
        }
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}

