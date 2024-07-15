import styles from "./card.module.scss";
import clsx from "clsx";
import { Checkbox } from "react-aria-components";
import { Card } from "@/components/card";
import { Feedback, feedbackAddressed, feedbackRemoved } from "./slice-old";
import { useAppDispatch } from "@/pretyped";
import { IconButton } from "@/components/icon-button";
import { Symbol } from "@/components/symbol";

interface FeedbackCardProps {
  feedback: Feedback;
}

export function FeedbackCard({ feedback }: FeedbackCardProps) {
  const dispatch = useAppDispatch();
  return (
    <div className={styles.feedbackCard}>
      <Card
        as={Checkbox}
        className={clsx(styles.section, styles.text, styles.checkbox)}
        isSelected={feedback.addressed}
        onChange={(addressed: boolean) =>
          dispatch(feedbackAddressed({ id: feedback.id, addressed }))
        }
      >
        {feedback.title && <h3 className={styles.title}>{feedback.title}</h3>}
        {feedback.comment}
      </Card>
      <Card className={clsx(styles.section, styles.actions)}>
        <IconButton onPress={console.log}>
          <Symbol>edit</Symbol>
        </IconButton>
        <IconButton onPress={() => dispatch(feedbackRemoved(feedback.id))}>
          <Symbol>delete</Symbol>
        </IconButton>
      </Card>
    </div>
  );
}
