"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function WellbeingTeam() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Page Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-[#ff961b] mb-2">
          Right2Thrive UK – Wellbeing Team
        </h1>
        <p className="text-gray-600 text-lg">
          Meet our dedicated team of mental health professionals
        </p>
      </div>

      {/* Team Profiles */}
      <div className="space-y-12">
        {/* Ekeisha – Wellbeing Coach */}
        <Card className="border-2 border-teal-100">
          <CardHeader className="text-center flex flex-col items-center">
            <div className="mx-auto mb-4">
              <Image
                src="/Ekeisha E.jpg"
                alt="Portrait of Ekeisha, Wellbeing Coach at Right2Thrive UK"
                width={160}
                height={160}
                className="rounded-full object-cover object-top w-32 h-32 border-4 border-brand-teal shadow-md"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-[#ff961b]">
              Ekeisha
            </CardTitle>
            <p className="text-lg text-gray-700 font-semibold mt-2">
              Wellbeing Coach
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-teal-700 mb-3">
                Meet Ekeisha – Your Wellbeing Coach at Right2Thrive UK
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Ekeisha is a warm, supportive, and culturally aware wellbeing coach dedicated to helping young people feel motivated, confident, and empowered. With a strong background in psychology, counselling, and education, she understands the real life challenges young people face — including stress, low motivation, family expectations, cultural pressures, and emotional struggles.
              </p>
              <p className="text-gray-700 leading-relaxed mt-3">
                She believes that everyone&apos;s wellbeing journey is unique and shaped by culture, identity, and personal experience. Her approach is always respectful, non judgemental, and centred on what you need.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-teal-700 mb-3">
                How Ekeisha Supports You
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Talk openly about any worries, challenges, or barriers.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Understand how culture, family, or community expectations may affect your mental health.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Build motivation, confidence, and positive coping strategies.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Set realistic, achievable goals and stay on track.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Access extra support for anything affecting your progress.</span>
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                She also works closely with our CBT psychologist team. With your permission, she shares feedback to ensure your support is personalised, culturally sensitive, and aligned with your wellbeing needs.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-teal-700 mb-3">
                Experience
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Teaching in London mainstream primary schools (ages 5–11), planning and delivering UK curriculum lessons.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Providing person centred therapeutic care to individuals with anxiety, depression, schizophrenia, bipolar disorder, and complex social or emotional needs.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Supporting young people in both mainstream and SEND settings, including those with autism, dyslexia, speech and cognitive delays, and behavioural challenges.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Offering counselling sessions as a trainee counsellor, guided by ethical and safeguarding principles.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Conducting qualitative and quantitative mental health research using DSM frameworks.</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-teal-700 mb-3">
                Qualifications
              </h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">PGCE Primary (Teacher Trainee, Goldsmiths)</Badge>
                <Badge variant="secondary">MSc Psychology</Badge>
                <Badge variant="secondary">Certificate in Counselling Studies</Badge>
                <Badge variant="secondary">Diploma in Health Sciences</Badge>
                <Badge variant="secondary">BA (Hons) Music Production, Performance and Business</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        {/* Angela – Therapist */}
        <Card className="border-2 border-teal-100">
          <CardHeader className="text-center flex flex-col items-center">
            <div className="mx-auto mb-4">
              <Image
                src="/Angela.jpeg"
                alt="Portrait of Angela, Therapist at Right2Thrive UK Wellbeing Hub"
                width={160}
                height={160}
                className="rounded-full object-cover object-top w-32 h-32 border-4 border-brand-teal shadow-md"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-[#ff961b]">
              Angela
            </CardTitle>
            <p className="text-lg text-gray-700 font-semibold mt-2">
              Therapist
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-teal-700 mb-3">
                Meet Angela – Therapist at Right2Thrive UK Wellbeing Hub
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Angela is a calm, compassionate, and highly experienced therapist offering a safe and confidential space for adults, children, and young people. With over 15 years of experience, she supports clients through some of life&apos;s most challenging moments, helping them feel heard, understood, and empowered to move forward at their own pace.
              </p>
              <p className="text-gray-700 leading-relaxed mt-3">
                Her approach is warm, culturally aware, and holistic — recognising that wellbeing is shaped by our past experiences, environment, identity, relationships, and daily pressures. Angela tailors therapy to each person&apos;s individual needs, making sure everyone feels comfortable, respected, and supported.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-teal-700 mb-3">
                How Angela Supports You
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                Angela specialises in helping people work through a wide range of emotional and wellbeing needs, including:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Domestic abuse.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Sexual abuse (supporting both adults and children).</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Anxiety and depression.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Stress and trauma related difficulties.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Work related emotional challenges.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Sight loss related emotional wellbeing.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Child focused play therapy.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Cultural and identity related issues.</span>
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                Her sessions offer space to explore feelings, develop coping strategies, and understand your personal experiences without judgement.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-teal-700 mb-3">
                Her Therapeutic Approach
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                Angela works holistically and mindfully, recognising that emotional health is connected to the whole of a person — mind, body, relationships, and environment.
              </p>
              <p className="text-gray-700 leading-relaxed mb-3">
                She uses Person Centred Therapy and Play Therapy, adapting her approach depending on the age, needs, and goals of each client. Whether through talking, creative play, or reflective exploration, she ensures every session feels safe, gentle, and supportive.
              </p>
              <p className="text-gray-700 leading-relaxed mb-3">
                She works with:
              </p>
              <ul className="space-y-1 text-gray-700 mb-3">
                <li>• Adults</li>
                <li>• Young people</li>
                <li>• Children</li>
                <li>• Couples</li>
                <li>• Older adults</li>
                <li>• Organisations</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-3">
                And she offers therapy through:
              </p>
              <ul className="space-y-1 text-gray-700">
                <li>• Online sessions</li>
                <li>• Telephone sessions</li>
                <li>• Email or text therapy</li>
                <li>• Short term or long term work</li>
                <li>• Time limited programmes</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-teal-700 mb-3">
                Your First Session With Angela
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                <strong>For adults (free 30 minute intro session):</strong> Your first session is a chance to get to know each other. Angela will gently explore what&apos;s brought you to therapy, answer any questions, and explain how she works. There&apos;s no pressure — the focus is simply on seeing whether it feels like the right fit for you.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>For children &amp; young people (under 18s):</strong> Angela creates a relaxed, welcoming space where children can feel safe. In the first session, children and young people can choose to talk, draw, play, or simply get comfortable — there&apos;s no right or wrong way to be. Angela&apos;s role is to help make sense of big feelings in a way that feels gentle and reassuring.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-teal-700 mb-3">
                Issues Angela Can Help With
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                Angela supports people with a wide range of challenges, including:
              </p>
              <p className="text-gray-700 leading-relaxed">
                Abuse, anxiety, bereavement, child related issues, cultural issues, depression, health related concerns, identity issues, loss, menopause, neurodiversity, relationships, self esteem, stress, women&apos;s issues, work related issues, and trauma.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-teal-700 mb-3">
                Qualifications &amp; Professional Details
              </h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Therapist (15+ years&apos; experience)</Badge>
                <Badge variant="secondary">Specialist in Person Centred Therapy and Play Therapy</Badge>
                <Badge variant="secondary">Registered Professional Therapist</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        {/* Evette Bailey */}
        <Card className="border-2 border-teal-100">
          <CardHeader className="text-center flex flex-col items-center">
            <div className="mx-auto mb-4">
              <Image
                src="/Evette Bailey.jpeg"
                alt="Portrait of Evette Bailey, Senior CBT Practitioner"
                width={160}
                height={160}
                className="rounded-full object-cover object-top w-32 h-32 border-4 border-brand-teal shadow-md"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-[#ff961b]">
              Evette Bailey
            </CardTitle>
            <p className="text-lg text-gray-700 font-semibold mt-2">
              Senior CBT Practitioner
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-700 leading-relaxed">
              Evette is a highly experienced Cognitive Behavioural Therapy (CBT) practitioner with over 30 years' experience in mental health, supporting both adolescents and adults.
            </p>

            <div>
              <h3 className="text-xl font-semibold text-teal-700 mb-3">Expertise</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>Extensive Experience:</strong> With more than three decades in practice, Evette brings deep knowledge and clinical expertise to every session, offering clients meaningful insight and effective therapeutic interventions.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>Empathy and Understanding:</strong> She uses a compassionate, client centred approach that builds trust and supports clients to engage confidently in their healing journey.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>Proven Success:</strong> Evette has a strong record of positive therapeutic outcomes, with many clients achieving significant improvements in mental health and wellbeing.</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-teal-700 mb-3">Supervision</h3>
              <p className="text-gray-700 leading-relaxed">
                Evette provides clinical supervision to the Right2Thrive UK Psychology Team, ensuring high quality practice, confidentiality, ethical standards, accurate record keeping, and ongoing professional development.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-teal-700 mb-3">Accreditations & Qualifications</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="secondary">BABCP Accredited</Badge>
                <Badge variant="secondary">Dip/PG Social Work</Badge>
                <Badge variant="secondary">BSc (Hons) Social Science</Badge>
                <Badge variant="secondary">Therapeutic Communication with Children</Badge>
                <Badge variant="secondary">Dip/PG Child & Young Person IAPT</Badge>
                <Badge variant="secondary">IAPT Supervisor Certificate</Badge>
                <Badge variant="secondary">Dip/PG Cognitive Behavioural Therapy</Badge>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-teal-700 mb-3">Approach</h3>
              <p className="text-gray-700 leading-relaxed">
                Evette works within cognitive, behavioural, and humanistic frameworks. She uses evidence based CBT interventions including cognitive restructuring, guided discovery, exposure work, behavioural activation, relaxation skills, mindfulness, and solution focused strategies.
              </p>
            </div>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        {/* Mauva Johnson Jones */}
        <Card className="border-2 border-teal-100">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#ff961b]">
              Mauva Johnson Jones
            </CardTitle>
            <p className="text-lg text-gray-700 font-semibold mt-2">
              Founder & Director, Precious Moments and Health Ltd
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-teal-700 mb-3">Experience</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Over 25 years' experience mentoring and supporting children, young people, and families across schools, local authorities, and community settings.</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-teal-700 mb-3">Specialism</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Supporting children with emotional and behavioural challenges.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Integrative counselling using CBT, Solution Focused Therapy, and Play Therapy.</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-teal-700 mb-3">Professional Membership</h3>
              <p className="text-gray-700 leading-relaxed">
                <Badge variant="secondary">British Association for Counselling and Psychotherapy (BACP)</Badge>
              </p>
            </div>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        {/* Kevin Bachan Singh */}
        <Card className="border-2 border-teal-100">
          <CardHeader className="text-center flex flex-col items-center">
            <div className="mx-auto mb-4">
              <Image
                src="/Kevin Bachan Singh.jpeg"
                alt="Portrait of Kevin Bachan Singh, Behaviour Mentor and Psychodynamic Counsellor"
                width={160}
                height={160}
                className="rounded-full object-cover object-top w-32 h-32 border-4 border-brand-teal shadow-md"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-[#ff961b]">
              Kevin Bachan Singh BSc, Dip.Couns
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-700 leading-relaxed">
              Kevin has spent the last 18 years working within the Enfield Secondary Tuition Centre (Pupil Referral Unit), across three sites, supporting some of the most vulnerable and disengaged students and families in the Borough of Enfield.
            </p>

            <p className="text-gray-700 leading-relaxed">
              His work began as a Learning Behaviour Mentor, supporting students in lessons and delivering one to one mentoring to promote positive behaviour. Four years into this role, he was appointed Centre Manager for the KS3 Newbury site, where he successfully reintegrated many students back into mainstream education.
            </p>

            <div>
              <h3 className="text-xl font-semibold text-teal-700 mb-3">Training</h3>
              <p className="text-gray-700 mb-2">Kevin has completed a wide range of behaviour focused training, including:</p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Pivotal behaviour training with Paul Dix</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Talking Mats</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Approach Training</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Safeguarding Training</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Cornerstone VR Training</span>
                </li>
              </ul>
            </div>

            <p className="text-gray-700 leading-relaxed">
              In 2019, while working full time, Kevin began formal therapy training with Enfield Counselling and Psychotherapy Service. After completing the Certificate year, he went on to achieve a three year Diploma in Psychodynamic Counselling, graduating in July 2024.
            </p>

            <p className="text-gray-700 leading-relaxed">
              His therapeutic journey offered a new perspective on behaviour—one grounded in emotional understanding, non judgement, and the transformative power of the therapeutic relationship. With extensive behavioural work and psychodynamic training, Kevin is committed to expanding his impact by providing behavioural support, training, and therapeutic services to a wider community.
            </p>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        {/* Vanessa Boachie */}
        <Card className="border-2 border-teal-100">
          <CardHeader className="text-center flex flex-col items-center">
            <div className="mx-auto mb-4">
              <Image
                src="/Vanessa Boachie.jpeg"
                alt="Portrait of Vanessa Boachie, Psychological Therapist and Social Entrepreneur"
                width={160}
                height={160}
                className="rounded-full object-cover object-top w-32 h-32 border-4 border-brand-teal shadow-md"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-[#ff961b]">
              Vanessa Boachie (BSc, PGCert)
            </CardTitle>
            <p className="text-lg text-gray-700 font-semibold mt-2">
              Psychological Therapist | Social Entrepreneur
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-700 leading-relaxed">
              Vanessa is an award winning social entrepreneur and qualified Psychological Therapist specialising in CBT. With nine years' experience in mental health, she is particularly passionate about culturally sensitive therapeutic approaches.
            </p>

            <p className="text-gray-700 leading-relaxed">
              She supports individuals experiencing depression, anxiety, social anxiety, low self esteem, life transitions, trauma, and emotional hardship. Vanessa helps clients overcome psychological barriers by exploring the underlying causes of distress and implementing practical strategies through one to one sessions and group workshops.
            </p>

            <p className="text-gray-700 leading-relaxed">
              Vanessa has delivered workshops and healing spaces across the UK in higher education, corporate settings, and faith communities. She has collaborated with respected organisations including JP Morgan, Virgin Group Ltd, Tesco, BBC, NHS, HMPPS, and CMS International Law Firm.
            </p>

            <p className="text-gray-700 leading-relaxed">
              She is dedicated to helping individuals deepen their self understanding and 'live their best lives'.
            </p>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        {/* Raveen Charles */}
        <Card className="border-2 border-teal-100">
          <CardHeader className="text-center flex flex-col items-center">
            <div className="mx-auto mb-4">
              <Image
                src="/rc.jpeg"
                alt="Portrait of Raveen Charles, Registered Psychotherapist"
                width={160}
                height={160}
                className="rounded-full object-cover object-top w-32 h-32 border-4 border-brand-teal shadow-md"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-[#ff961b]">
              Raveen Charles (She/Her)
            </CardTitle>
            <p className="text-lg text-gray-700 font-semibold mt-2">
              Registered Psychotherapist
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-teal-700 mb-3">Experience</h3>
              <p className="text-gray-700 leading-relaxed">
                Over 10 years' experience in mental health and social care, including roles within homelessness services, the Probation Service, the NHS, and local authorities.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-teal-700 mb-3">Qualifications</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>BSc Psychology (University of Leeds)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Postgraduate Diploma in Psychotherapy</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Certifications in Compassion Focused Therapy, Clinical Hypnotherapy, Trauma Release Exercise, Meditation, and DBT Skills</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-teal-700 mb-3">Specialism</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                Holistic mental health care incorporating cultural, societal, lifestyle, and spiritual factors.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Raveen offers integrative psychotherapy with a holistic focus, supporting harmony between mind, body, and soul. She creates a gentle, healing, and non judgemental therapeutic space where clients can explore emotional challenges with compassion and openness.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-teal-700 mb-3">Her work emphasises:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Somatic and body focused practices</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Meditative and mindfulness based techniques</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Breathwork and trauma/emotion release exercises</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Clinical hypnotherapy</span>
                </li>
              </ul>
            </div>

            <p className="text-gray-700 leading-relaxed">
              Raveen supports clients in reconnecting with themselves, deepening self awareness, and moving from emotional difficulty to greater freedom, fulfilment, and joy. She works with individuals beyond labels or diagnoses, honouring their whole person experience.
            </p>

            <div>
              <h3 className="text-xl font-semibold text-teal-700 mb-3">Professional Membership</h3>
              <p className="text-gray-700 leading-relaxed">
                <Badge variant="secondary">BACP – British Association for Counselling & Psychotherapy (Accredited Register)</Badge>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

