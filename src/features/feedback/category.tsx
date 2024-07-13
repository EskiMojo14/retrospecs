import {
  categories,
  Category,
  feedbackAddressed,
  feedbackRemoved,
  selectFeedbackByCategory,
} from "./slice";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "../../pretyped";
import { FeedbackCard } from "./card";
import styles from "./category.module.scss";
import { IconButton } from "../../components/icon-button";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
  const dispatch = useAppDispatch();
  const feedback = useAppSelector((state) =>
    selectFeedbackByCategory(state, category)
  );
  return (
    <div className={clsx(styles.category, styles[category])}>
      <h2>{categoryTitles[category]}</h2>
      {feedback.map((f) => (
        <FeedbackCard
          key={f.id}
          checked={f.addressed}
          onCheck={(checked) =>
            dispatch(feedbackAddressed({ id: f.id, addressed: checked }))
          }
          actions={
            <>
              <IconButton onPress={console.log}>
                <FontAwesomeIcon icon={faPen} />
              </IconButton>
              <IconButton onPress={() => dispatch(feedbackRemoved(f.id))}>
                <FontAwesomeIcon icon={faTrash} />
              </IconButton>
            </>
          }
        >
          {f.comment}
        </FeedbackCard>
      ))}
    </div>
  );
}
