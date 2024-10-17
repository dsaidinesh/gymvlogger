'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Workout = {
  _id: string
  day: string
  name: string
  sets: number
  reps: number
  weight: number
}

type DayWorkouts = {
  [key: string]: Workout[]
}

export function GymPlannerComponent() {
  const [workouts, setWorkouts] = useState<DayWorkouts>({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  })

  const [selectedDay, setSelectedDay] = useState<string>('')
  const [newWorkout, setNewWorkout] = useState<Omit<Workout, '_id' | 'day'>>({
    name: '',
    sets: 0,
    reps: 0,
    weight: 0,
  })

  useEffect(() => {
    fetchWorkouts()
  }, [])

  const fetchWorkouts = async () => {
    try {
      const response = await fetch('/api/workouts')
      const data = await response.json()
      const groupedWorkouts = data.reduce((acc: DayWorkouts, workout: Workout) => {
        if (!acc[workout.day]) {
          acc[workout.day] = []
        }
        acc[workout.day].push(workout)
        return acc
      }, {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: [],
      })
      setWorkouts(groupedWorkouts)
    } catch (error) {
      console.error('Error fetching workouts:', error)
      setWorkouts({
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: [],
      })
    }
  }

  const addWorkout = async () => {
    if (selectedDay) {
      try {
        const response = await fetch('/api/workouts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...newWorkout, day: selectedDay }),
        });
        if (response.ok) {
          const addedWorkout = await response.json();
          setWorkouts(prevWorkouts => ({
            ...prevWorkouts,
            [selectedDay]: [...prevWorkouts[selectedDay], addedWorkout.data]
          }));
          setNewWorkout({ name: '', sets: 0, reps: 0, weight: 0 });
        } else {
          const errorData = await response.json();
          console.error('Error adding workout:', errorData);
        }
      } catch (error) {
        console.error('Error adding workout:', error);
      }
    }
  }

  const deleteWorkout = async (workoutId: string) => {
    const response = await fetch('/api/workouts', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: workoutId }),
    })
    if (response.ok) {
      fetchWorkouts()
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
      <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-6 text-center fixed top-0 left-0 right-0 z-10 shadow-lg">
        <h1 className="text-3xl font-bold">Gym Planner</h1>
      </header>

      <main className="flex-grow container mx-auto px-4 pt-24 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(workouts).map(([day, dayWorkouts]) => (
            <Card key={day} className="flex flex-col bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-105">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-teal-500 text-white">
                <CardTitle className="text-xl font-bold">{day}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow p-4">
                {dayWorkouts.map((workout) => (
                  <div key={workout._id} className="flex justify-between items-center mb-3 p-2 bg-gray-100 dark:bg-gray-700 rounded-md shadow">
                    <span className="text-gray-800 dark:text-gray-200">{workout.name} - {workout.sets}x{workout.reps} @ {workout.weight}kg</span>
                    <Button variant="ghost" size="icon" onClick={() => deleteWorkout(workout._id)} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="p-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-semibold" onClick={() => setSelectedDay(day)}>
                      <Plus className="mr-2 h-4 w-4" /> Add Workout
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white dark:bg-gray-800">
                    <DialogHeader className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-4 rounded-t-lg">
                      <DialogTitle className="text-xl font-bold">Add Workout for {selectedDay}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input
                          id="name"
                          value={newWorkout.name}
                          onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="sets" className="text-right">
                          Sets
                        </Label>
                        <Input
                          id="sets"
                          type="number"
                          value={newWorkout.sets}
                          onChange={(e) => setNewWorkout({ ...newWorkout, sets: parseInt(e.target.value) })}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="reps" className="text-right">
                          Reps
                        </Label>
                        <Input
                          id="reps"
                          type="number"
                          value={newWorkout.reps}
                          onChange={(e) => setNewWorkout({ ...newWorkout, reps: parseInt(e.target.value) })}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="weight" className="text-right">
                          Weight (kg)
                        </Label>
                        <Input
                          id="weight"
                          type="number"
                          value={newWorkout.weight}
                          onChange={(e) => setNewWorkout({ ...newWorkout, weight: parseFloat(e.target.value) })}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" onClick={addWorkout}>
                        Add Workout
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      <footer className="bg-secondary text-secondary-foreground py-4 text-center">
        <p>© 2024 Gym Planner. All Rights Reserved.</p>
      </footer>
    </div>
  )
}
