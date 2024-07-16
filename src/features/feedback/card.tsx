import clsx from "clsx";
import { ToggleButton } from "react-aria-components";
import type { Feedback } from "./slice-old";
import { feedbackAddressed, feedbackRemoved } from "./slice-old";
import {
  Card,
  CardActionIcon,
  CardActionIcons,
  CardActions,
  CardPrimaryAction,
} from "@/components/card";
import { Symbol } from "@/components/symbol";
import { useAppDispatch } from "@/pretyped";
import styles from "./card.module.scss";

interface FeedbackCardProps {
  feedback: Feedback;
}

export function FeedbackCard({ feedback }: FeedbackCardProps) {
  const dispatch = useAppDispatch();
  return (
    <Card className={styles.feedbackCard}>
      <CardPrimaryAction
        as={ToggleButton}
        className={clsx(styles.text)}
        isSelected={feedback.addressed}
        onChange={(addressed: boolean) =>
          dispatch(feedbackAddressed({ id: feedback.id, addressed }))
        }
      >
        {feedback.title && <h3 className={styles.title}>{feedback.title}</h3>}
        {feedback.comment}
      </CardPrimaryAction>
      <CardActions>
        <CardActionIcons>
          <CardActionIcon onPress={console.log}>
            <Symbol>edit</Symbol>
          </CardActionIcon>
          <CardActionIcon
            onPress={() => dispatch(feedbackRemoved(feedback.id))}
          >
            <Symbol>delete</Symbol>
          </CardActionIcon>
        </CardActionIcons>
      </CardActions>
    </Card>
  );
}
