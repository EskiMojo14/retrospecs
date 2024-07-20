import { clsx } from "clsx";
import { DialogTrigger, ToggleButton } from "react-aria-components";
import { Button } from "~/components/button";
import {
  Card,
  CardActionIcon,
  CardActions,
  CardPrimaryAction,
} from "~/components/card";
import { Dialog, DialogContent } from "~/components/dialog";
import { Symbol } from "~/components/symbol";
import { Toolbar } from "~/components/toolbar";
import { Heading, Typography } from "~/components/typography";
import { useAppDispatch } from "~/store/pretyped";
import type { Feedback } from "./slice-old";
import { feedbackAddressed, feedbackRemoved } from "./slice-old";
import styles from "./card.module.scss";
interface FeedbackCardProps {
  feedback: Feedback;
}

export function FeedbackCard({ feedback }: FeedbackCardProps) {
  const dispatch = useAppDispatch();
  return (
    <Card className={styles.feedbackCard} variant="raised">
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
        <Toolbar slot="icons">
          <CardActionIcon onPress={console.log}>
            <Symbol>edit</Symbol>
          </CardActionIcon>
          <DialogTrigger>
            <CardActionIcon>
              <Symbol>delete</Symbol>
            </CardActionIcon>
            <Dialog>
              {({ close }) => (
                <>
                  <Heading variant="headline6" slot="title">
                    Delete feedback
                  </Heading>
                  <DialogContent>
                    <blockquote className={styles.quote}>
                      {feedback.title && (
                        <Typography variant="subtitle1">
                          {feedback.title}
                        </Typography>
                      )}
                      <Typography variant="body2">
                        {feedback.comment}
                      </Typography>
                    </blockquote>
                    <Typography variant="body1">
                      Are you sure you want to delete this feedback?
                    </Typography>
                  </DialogContent>
                  <Toolbar slot="actions">
                    <Button onPress={close}>Cancel</Button>
                    <Button
                      onPress={() => {
                        dispatch(feedbackRemoved(feedback.id));
                        close();
                      }}
                      variant="elevated"
                      color="red"
                    >
                      Delete
                    </Button>
                  </Toolbar>
                </>
              )}
            </Dialog>
          </DialogTrigger>
        </Toolbar>
      </CardActions>
    </Card>
  );
}
