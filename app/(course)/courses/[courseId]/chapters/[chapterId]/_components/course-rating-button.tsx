"use client";


import { useState , useEffect} from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface RatingComponentProps {
  userId: string;
  courseId: string;
  isCompleted: boolean;
}

export const RatingComponent = ({ 
    userId, 
    courseId, 
    isCompleted 
}: RatingComponentProps) => {
    const [rating, setRating] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [ratingProvided, setRatingProvided] = useState(false);
    const router = useRouter();
  
    useEffect(() => {
        // Fetch the user's rating from local storage
        const userRating = localStorage.getItem(`rating-${userId}-${courseId}`);
        if (userRating) {
            setRating(parseInt(userRating));
            setRatingProvided(true);
        }
    }, [userId, courseId]);

    

    const handleRating = async (ratingValue: number) => {
      if (!isCompleted || ratingProvided) return;
  
      try {
        await axios.post(`/api/courses/${courseId}/rating`, {
          userId,
          courseId,
          rating: ratingValue,
        });

        setRating(ratingValue);
        
        setRatingProvided(true);
        
        router.refresh();
      } catch (error) {
        setError("Failed to submit rating");
        console.error(error);
      }
    };
  
    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Rate this course</h3>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRating(star)}
              className={`p-2 rounded-full ${rating === star ? "bg-yellow-400" : "bg-gray-300"}`}
              disabled={ratingProvided}
            >
              {star} ★
            </button>
          ))}
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {ratingProvided && <p className="text-green-500">Rating has been provided and cannot be changed.</p>}
      </div>
    );
  };
