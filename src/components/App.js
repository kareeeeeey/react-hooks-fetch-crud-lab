import React, { useState, useEffect } from "react";
import AdminNavBar from "./AdminNavBar";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";

function App() {
  const [page, setPage] = useState("List");
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:4000/questions");
        if (!response.ok) {
          throw new Error("Failed to fetch questions");
        }
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleAddQuestion = async (newQuestion) => {
    try {
      const response = await fetch("http://localhost:4000/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: newQuestion.prompt,
          answers: [
            newQuestion.answer1,
            newQuestion.answer2,
            newQuestion.answer3,
            newQuestion.answer4,
          ],
          correctIndex: parseInt(newQuestion.correctIndex),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add question");
      }

      const data = await response.json();
      setQuestions([...questions, data]);
    } catch (error) {
      console.error("Error adding question:", error);
    }
  };

  const handleDeleteQuestion = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/questions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete question");
      }

      setQuestions(questions.filter((question) => question.id !== id));
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const handleUpdateCorrectIndex = async (id, correctIndex) => {
    try {
      const response = await fetch(`http://localhost:4000/questions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correctIndex }),
      });

      if (!response.ok) {
        throw new Error("Failed to update question");
      }

      setQuestions(
        questions.map((question) =>
          question.id === id ? { ...question, correctIndex } : question
        )
      );
    } catch (error) {
      console.error("Error updating question:", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <main>
      <AdminNavBar onChangePage={setPage} />
      {page === "Form" ? (
        <QuestionForm onAddQuestion={handleAddQuestion} />
      ) : (
        <QuestionList
          questions={questions}
          onDeleteQuestion={handleDeleteQuestion}
          onUpdateQuestion={handleUpdateCorrectIndex}
        />
      )}
    </main>
  );
}

export default App;
