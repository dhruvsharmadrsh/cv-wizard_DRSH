import { cn } from "~/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "./Accordion";
import ScoreBadge from "./ScoreBadge";

/* M-Stripe */
function MStripe() {
  return (
    <div className="details-stripe">
      <div className="details-stripe__s1" />
      <div className="details-stripe__s2" />
      <div className="details-stripe__s3" />
    </div>
  );
}

const CategoryHeader = ({
  title,
  categoryScore,
}: {
  title: string;
  categoryScore: number;
}) => {
  const titleIcons: Record<string, JSX.Element> = {
    "Tone & Style": (
      <svg className="details-cat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
      </svg>
    ),
    "Content": (
      <svg className="details-cat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    "Structure": (
      <svg className="details-cat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    "Skills": (
      <svg className="details-cat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  };

  return (
    <div className="details-cat-header">
      <div className="details-cat-header__left">
        <div className="details-cat-header__icon-box">
          {titleIcons[title] || titleIcons["Content"]}
        </div>
        <h3 className="details-cat-header__title">{title}</h3>
      </div>
      <ScoreBadge score={categoryScore} />
    </div>
  );
};

const CategoryContent = ({
  tips,
}: {
  tips: { type: "good" | "improve"; tip: string; explanation: string }[];
}) => {
  return (
    <div className="details-content">
      <h4 className="details-content__title">
        <span className="details-content__slash">///</span> DETAILED ANALYSIS
      </h4>
      <div className="details-content__tips">
        {tips.map((tip, index) => (
          <div key={index + tip.tip} className="details-tip">
            <div className="details-tip__icon-wrap">
              {tip.type === "good" ? (
                <div className="details-tip__icon details-tip__icon--good">
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : (
                <div className="details-tip__icon details-tip__icon--improve">
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 6v6m0 4h.01" />
                  </svg>
                </div>
              )}
            </div>
            <div className="details-tip__body">
              <h5 className={`details-tip__title ${tip.type === "good" ? "details-tip__title--good" : "details-tip__title--improve"}`}>
                {tip.tip}
              </h5>
              <p className="details-tip__explanation">
                {tip.explanation}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Details = ({ feedback }: { feedback: Feedback }) => {
  const categories = [
    { id: "tone-style", title: "Tone & Style", data: feedback.toneAndStyle },
    { id: "content", title: "Content", data: feedback.content },
    { id: "structure", title: "Structure", data: feedback.structure },
    { id: "skills", title: "Skills", data: feedback.skills }
  ];

  return (
    <div className="details-component">
      {/* Header */}
      <div className="details-header">
        <div className="details-header__top">
          <div className="details-header__icon-box">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <div>
            <h2 className="details-header__title">DETAILED FEEDBACK</h2>
            <p className="details-header__sub">Comprehensive analysis of your resume components</p>
          </div>
        </div>
        <MStripe />
      </div>

      {/* Accordion */}
      <Accordion>
        {categories.map((category) => (
          <AccordionItem key={category.id} id={category.id}>
            <AccordionHeader itemId={category.id}>
              <CategoryHeader
                title={category.title}
                categoryScore={category.data.score}
              />
            </AccordionHeader>
            <AccordionContent itemId={category.id}>
              <CategoryContent tips={category.data.tips} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <style>{`
        .details-component {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 32px;
        }

        /* ---- Header ---- */
        .details-header { margin-bottom: 8px; }

        .details-header__top {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }

        .details-header__icon-box {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #3c3c3c;
          background: #000;
          color: #fff;
          flex-shrink: 0;
        }

        .details-header__title {
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: -0.5px;
          line-height: 1;
          margin-bottom: 4px;
        }

        .details-header__sub {
          font-size: 14px;
          font-weight: 300;
          color: #7e7e7e;
        }

        .details-stripe { display: flex; height: 4px; width: 100%; }
        .details-stripe__s1 { flex: 1; background: #0066b1; }
        .details-stripe__s2 { flex: 1; background: #1c69d4; }
        .details-stripe__s3 { flex: 1; background: #e22718; }

        /* ---- Category Header ---- */
        .details-cat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          width: 100%;
          padding: 4px 0;
        }

        .details-cat-header__left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .details-cat-header__icon-box {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #3c3c3c;
          background: #000;
          flex-shrink: 0;
          transition: border-color 0.3s ease;
        }

        .details-cat-icon {
          width: 18px;
          height: 18px;
          color: #fff;
        }

        .details-cat-header__title {
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* ---- Content ---- */
        .details-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .details-content__title {
          font-size: 12px;
          font-weight: 700;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .details-content__slash { color: #7e7e7e; }

        .details-content__tips {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .details-tip {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 20px;
          background: #0d0d0d;
          border: 1px solid #262626;
          transition: border-color 0.3s ease;
        }

        .details-tip:hover { border-color: #3c3c3c; }

        .details-tip__icon-wrap { margin-top: 2px; flex-shrink: 0; }

        .details-tip__icon {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid;
        }

        .details-tip__icon--good {
          color: #0fa336;
          border-color: #0fa336;
          background: rgba(15, 163, 54, 0.1);
        }

        .details-tip__icon--improve {
          color: #f4b400;
          border-color: #f4b400;
          background: rgba(244, 180, 0, 0.1);
        }

        .details-tip__body { flex: 1; min-width: 0; }

        .details-tip__title {
          font-size: 15px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          margin-bottom: 6px;
        }

        .details-tip__title--good { color: #fff; }
        .details-tip__title--improve { color: #f4b400; }

        .details-tip__explanation {
          font-size: 14px;
          font-weight: 300;
          color: #bbbbbb;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
};

export default Details;