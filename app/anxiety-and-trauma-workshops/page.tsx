"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function WellbeingWorkshops() {
  return (
    <div className="min-h-screen bg-white text-gray-800 py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-[#ff961b] mb-4">
          Free Online Wellbeing Workshops for Young Minds
        </h1>
        <p className="text-lg text-gray-600 mb-8">Helping You Thrive</p>

        <div className="text-left space-y-6">
          <p className="text-gray-700">
            <strong>Are you 16 to 24 years old?</strong>
            <br />
            We understand that life can be challenging, and we are here to
            support you in overcoming these challenges. These online sessions
            are designed to provide you with a better understanding of important
            topics and practical ways to cope. To attend, please register. These
            sessions are often in high demand, so we encourage you to register
            as soon as possible.
          </p>

          <p className="text-gray-700">
            We are committed to addressing health inequalities and are
            particularly keen to engage young people from African and Caribbean
            backgrounds, who are often underrepresented in accessing support.
          </p>

          {/* Workshop 1 */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle>Understanding Anxiety and Ways to Manage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                <strong>Date:</strong> 14th October <br />
                <strong>Time:</strong> 1-2 PM <br />
                <strong>Via:</strong> Zoom
              </p>
              <p>
                This workshop is for anyone curious about where anxiety stems
                from and how it manifests in our thoughts, behaviours, and
                beliefs. It is particularly beneficial for those who experience
                moments of anxiety that feel uncomfortable or overwhelming and
                who may struggle to calm their emotions.
              </p>
              <p>
                We will explore how anxiety develops in the mind and body,
                helping participants understand how they can manage symptoms of
                anxiety and improve their mental health and overall well-being.
              </p>
            </CardContent>
          </Card>

          {/* Workshop 2 */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle>Anger Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                <strong>Date:</strong> 23rd October <br />
                <strong>Time:</strong> 1-2 PM <br />
                <strong>Via:</strong> Zoom
              </p>
              <p>
                This workshop is designed for individuals who may find it
                difficult to manage anger, as well as for those who want to
                learn more about the nature of anger, where it originates, and
                how to address it in a healthy way.
              </p>
              <p>
                We will provide an overview of anger as an emotion, looking at
                its positive aspects, how it can be healthy, and what lies
                beneath its expression. We will also explore stereotypes
                surrounding anger in certain groups and discuss strategies for
                managing anger constructively.
              </p>
              <p>
                The session will include activities such as worksheets and a
                mini art exercise to help participants explore their own
                experiences with anger, understand its roots, and learn healthy
                ways to express and release it.
              </p>
            </CardContent>
          </Card>

          {/* Workshop 3 */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle>Distress Tolerance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                <strong>Date:</strong> 29th October <br />
                <strong>Time:</strong> 2 PM <br />
                <strong>Via:</strong> Zoom
              </p>
              <p>
                This workshop is for those who struggle with managing their
                emotions and staying calm during stressful situations. It is
                also helpful for individuals who feel overwhelmed by distressing
                circumstances or for those who work with or support someone
                facing such challenges.
              </p>
              <p>
                The session will focus on Distress Tolerance, a skill from
                Dialectical Behavior Therapy (DBT). While DBT was initially
                developed for individuals with personality disorders or those
                who self-harm, its tools are beneficial for anyone seeking to
                better regulate their emotional responses and reduce emotional
                intensity.
              </p>
              <p>
                Participants will learn practical techniques, including
                mindfulness practices and physical actions, to manage distress
                effectively. We will also discuss common triggers for distress
                and strategies for responding to difficult situations in a
                positive and constructive way.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
