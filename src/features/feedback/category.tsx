import { categories, Category, selectFeedbackByCategory } from "./slice-old";
import clsx from "clsx";
import { useAppSelector } from "@/pretyped";
import { FeedbackCard } from "./card";
import styles from "./category.module.scss";

interface CategoryProps {
  category: Category;
}

const categoryTitles: Record<Category, string> = {
  good: "Good",
  improvement: "Needs improvement",
  neutral: "Neutral",
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
  const feedback = useAppSelector((state) =>
    selectFeedbackByCategory(state, category),
  );
  return (
    <div className={clsx(styles.category, styles[category])}>
      <h2>{categoryTitles[category]}</h2>
      {feedback.map((f) => (
        <FeedbackCard key={f.id} feedback={f} />
      ))}
    </div>
  );
}
