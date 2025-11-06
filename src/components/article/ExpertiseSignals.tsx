import { Shield, CheckCircle2, Award, TrendingUp } from "lucide-react"

interface ExpertiseSignalsProps {
  signals: {
    factChecked?: boolean
    peerReviewed?: boolean
    industryRecognition?: string[]
    citations?: number
    trustScore?: number
  }
}

export function ExpertiseSignals({ signals }: ExpertiseSignalsProps) {
  if (
    !signals.factChecked &&
    !signals.peerReviewed &&
    !signals.industryRecognition?.length &&
    !signals.citations &&
    !signals.trustScore
  ) {
    return null
  }

  return (
    <div className="my-8 p-6 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Trust & Expertise Signals</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {signals.factChecked && (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-card/50">
            <CheckCircle2 className="w-5 h-5 text-[color:var(--color-success)] flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-sm text-foreground">Fact-Checked</div>
              <div className="text-xs text-muted-foreground">Verified by editorial team</div>
            </div>
          </div>
        )}

        {signals.peerReviewed && (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-card/50">
            <Award className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-sm text-foreground">Peer Reviewed</div>
              <div className="text-xs text-muted-foreground">Reviewed by industry experts</div>
            </div>
          </div>
        )}

        {signals.citations && signals.citations > 0 && (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-card/50">
            <TrendingUp className="w-5 h-5 text-accent-2 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-sm text-foreground">{signals.citations} Citations</div>
              <div className="text-xs text-muted-foreground">Referenced by other sources</div>
            </div>
          </div>
        )}

        {signals.trustScore && (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-card/50">
            <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-sm text-foreground">Trust Score: {signals.trustScore}/100</div>
              <div className="text-xs text-muted-foreground">Based on accuracy and reliability</div>
            </div>
          </div>
        )}
      </div>

      {signals.industryRecognition && signals.industryRecognition.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="text-sm font-medium text-foreground mb-2">Industry Recognition</div>
          <div className="flex flex-wrap gap-2">
            {signals.industryRecognition.map((recognition, index) => (
              <span key={index} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                {recognition}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
