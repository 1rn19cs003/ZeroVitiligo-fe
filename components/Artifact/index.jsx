"use client";
import { useState } from 'react';
import styles from './styles.module.css';

export default function Artifact() {
    const [activeIndex, setActiveIndex] = useState(null);

    const faqData = [
        {
            question: "Time duration for results?",
            answer: (
                <>
                    <p>Time duration depends on following factors:</p>
                    <ul>
                        <li>Location</li>
                        <li>Color of hair on white spot</li>
                        <li>How old disease is</li>
                    </ul>
                    <p>Your wellness journey can take anywhere between 3-12 months. We know this is a long time frame but this is the bitter truth and anyone telling you different on the internet does not have your best interest in mind.</p>
                </>
            )
        },
        {
            question: "What is the cost for Kayakalp vitiligo treatment?",
            answer: (
                <>
                    <p>A lot of people only want to know a fixed cost amount however, cost depends on the following factors:</p>
                    <ul>
                        <li>Location - only face involved, or face +body involved, or face+body+palms/soles involved</li>
                        <li>Size - smaller patches can be relatively less costly compared to larger patches</li>
                    </ul>
                    <p>Please send us images of your white spots to guide you better</p>
                </>
            )
        },
        {
            question: "I have tried Allopath, homeopath, ayurveda. I did not get satisfactory results. How are you different?",
            answer: (
                <>
                    <p>Allopathy relies on suppression to avoid spreading. According to Allopath, this condition is incurable. Homeopathy science mentions that disease will increase first and then decrease. According to Ayurveda literature, this disease is difficult to treat.</p>
                    <p>We believe that this condition is a manageable disorder. Using a combination approach we believe in controlling the disease from spreading and re-pigmenting old white spots. Re-pigmentation and stability should happen at the same time for best results.</p>
                </>
            )
        },
        {
            question: "Will I have to do lot of diet restrictions?",
            answer: (
                <>
                    <p>NO, we do not suggest strict diet restrictions. It is a common misconception that diet plays a very important role in your treatment but there is no scientific evidence on this even now. We know that many ayurveda doctors recommend strict diet restrictions but we believe role of diet is only 5%. Results on this page are proof of this theory.</p>
                </>
            )
        },
        {
            question: "What results can I expect?",
            answer: (
                <>
                    <p>For the best vitiligo treatment important factors are:</p>
                    <ul>
                        <li>Your regularity and compliance</li>
                        <li>How old your disease is</li>
                        <li>Location of white spots</li>
                        <li>Color of hair on white spots</li>
                        <li>Medical history of person</li>
                        <li>Past therapy taken</li>
                    </ul>
                    <p>Vitiligo Results vary from person to person but as shown by many progress proofs on this page results are possible when you start your Best vitiligo treatment with Kayakalp Global</p>
                </>
            )
        },
        {
            question: "Can my white spots/vitiligo increase after joining you?",
            answer: (
                <>
                    <p>This happens when you were on allopath before. If you suddenly stopped your allopath therapy 2 or 3 months before coming to us, the disease tends to flare up which was suppressed by previous your doctor.</p>
                    <p>This is why we recommend a combination approach to avoid this scenario.</p>
                </>
            )
        },
        {
            question: "I can't visit personally. Can I online vitiligo treatment?",
            answer: (
                <>
                    <p>Yes, we have helped lacs of people in India. You can connect with us using the call, Whatsapp or form submit button and we will get back to you.</p>
                </>
            )
        },
        {
            question: "What happens after I join you? who takes care of me?",
            answer: (
                <>
                    <p>Once you decide to work with us, you are given a dedicated number and advisor for all your questions about your journey. You can call or Whatsapp us anytime between 9am and 5Pm with your questions and we will provide answer within same day. We believe this condition can be tackled by a proper relationship between doctor and patient therefore we encourage all our patients to stay connected with us and not disappear after starting. We have solutions to your issues provided you trust us.</p>
                </>
            )
        },
        {
            question: "Is treatment for Kids available?",
            answer: (
                <>
                    <p>Yes, we have special expertise in treating children suffering from Vitiligo. Please get in touch with us to know more.</p>
                </>
            )
        }
    ];

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className={styles.faqContainer}>
            <h1 className={styles.title}>Common Questions</h1>
            <div className={styles.faqWrapper}>
                <div className={styles.questionsList}>
                    {faqData.map((item, index) => (
                        <button
                            key={index}
                            className={`${styles.questionButton} ${activeIndex === index ? styles.active : ''}`}
                            onClick={() => toggleAccordion(index)}
                        >
                            <span className={styles.questionIcon}>?</span>
                            <span className={styles.questionText}>{item.question}</span>
                            <span className={styles.chevron}>
                                {activeIndex === index ? '−' : '+'}
                            </span>
                        </button>
                    ))}
                </div>
                <div className={styles.answersSection}>
                    {faqData.map((item, index) => (
                        <div
                            key={index}
                            className={`${styles.answerWrapper} ${activeIndex === index ? styles.answerActive : ''}`}
                        >
                            <div className={styles.answerContent}>
                                {item.answer}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};