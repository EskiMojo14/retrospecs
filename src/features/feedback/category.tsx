import { clsx } from "clsx";
import { LineBackground } from "@/components/line-background";
import { useAppSelector } from "@/pretyped";
import { FeedbackCard } from "./card";
import type { Category } from "./slice-old";
import { categories, selectFeedbackByCategory } from "./slice-old";
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
      <LineBackground scale={2}>
        <h2>{categoryTitles[category]}</h2>
        {feedback.map((f) => (
          <FeedbackCard key={f.id} feedback={f} />
        ))}
      </LineBackground>
    </div>
  );
}
