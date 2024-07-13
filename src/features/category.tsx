import {
  categories,
  Category,
  feedbackAddressed,
  feedbackRemoved,
  selectFeedbackByCategory,
} from "./slice";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "../pretyped";
import { Card } from "./card";
import styles from "./category.module.scss";

interface CategoryProps {
  category: Category;
}

const categoryTitles: Record<Category, string> = {
  good: "Good",
  improvement: "Needs improvement",
  neutral: "Neutral",
  carry: "Carry forward",
};

export function Categories() {
  return (
    <div className={styles.categories}>
      {categories.map((category) => (
        <CategoryCard key={category} category={category} />
      ))}
    </div>
  );
}

export function CategoryCard({ category }: CategoryProps) {
  const dispatch = useAppDispatch();
  const feedback = useAppSelector((state) =>
    selectFeedbackByCategory(state, category)
  );
  return (
    <div className={clsx(styles.category, styles[category])}>
      <h2>{categoryTitles[category]}</h2>
      {feedback.map((f) => (
        <Card
          key={f.id}
          message={f.comment}
          checked={f.addressed}
          onCheck={
            category === "carry"
              ? undefined
              : (checked) =>
                  dispatch(feedbackAddressed({ id: f.id, addressed: checked }))
          }
          onEdit={console.log}
          onDelete={() => dispatch(feedbackRemoved(f.id))}
        />
      ))}
    </div>
  );
}
