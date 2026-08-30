import { Clapperboard } from "lucide-react"

/**
 * Acknowledgement of where a scenario's footage came from, shown above the
 * video. The text is written by the admin at upload time (scenarios.video_credit
 * — see scripts/038_scenario_video_credit.sql); there is nothing in the R2
 * object that could tell us the match or the broadcaster.
 *
 * Scenarios uploaded before the column existed have no source recorded, so
 * those keep the instruction line that used to sit here rather than showing a
 * blank credit.
 */
export function ScenarioVideoCredit({ credit }: { credit?: string | null }) {
  const source = credit?.trim()

  if (!source) {
    return (
      <p className="text-sm italic text-muted-foreground">
        Watch the scenario carefully — you can pause the video and move back through the timeline. Enter your decision below.
      </p>
    )
  }

  return (
    <p className="flex items-start gap-2 text-sm text-muted-foreground">
      <Clapperboard className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>
        <span className="font-medium text-foreground">Footage:</span> {source}
      </span>
    </p>
  )
}
