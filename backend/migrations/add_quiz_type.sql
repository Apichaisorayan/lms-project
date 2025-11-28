-- Add quiz_type column to quizzes table
ALTER TABLE quizzes ADD COLUMN quiz_type TEXT DEFAULT 'post';

-- Update existing quizzes to be post-test by default
UPDATE quizzes SET quiz_type = 'post' WHERE quiz_type IS NULL;
