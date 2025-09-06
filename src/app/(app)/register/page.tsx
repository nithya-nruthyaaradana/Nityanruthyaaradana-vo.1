import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FadeIn, 
  Slide, 
  Scale, 
  StaggerContainer, 
  StaggerItem, 
  HoverAnimation, 
  TextAnimation,
  PageTransition 
} from "@/components/ui/professional-animations";
import { RegisterForm } from "@/components/register-form";
import { ArrowRight, CheckCircle, Users, Award, Clock } from "lucide-react";

// Prevent prerendering to avoid build-time errors
export const dynamic = 'force-dynamic';

const admissionSteps = [
  {
    icon: Users,
    title: "Initial Consultation",
    description: "Schedule a meeting with our instructors to discuss your goals and assess your current level."
  },
  {
    icon: Award,
    title: "Level Assessment",
    description: "We'll evaluate your skills and recommend the most suitable course level for your development."
  },
  {
    icon: Clock,
    title: "Class Scheduling",
    description: "Choose from our flexible class schedules that accommodate different time commitments."
  },
  {
    icon: CheckCircle,
    title: "Enrollment",
    description: "Complete the registration process and begin your journey with Bharatanatyam."
  }
];

export default function RegisterPage() {
  return (
    <PageTransition>
      <div>
        {/* Page Header */}
        <section className="py-10 sm:py-12 md:py-16 text-center bg-[#8B0000]">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <TextAnimation type="slide" direction="up" delay={0.2}>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-headline text-white">Join Our Academy</h1>
            </TextAnimation>
            <TextAnimation type="fade" delay={0.4}>
              <p className="mt-3 sm:mt-4 md:mt-6 max-w-2xl mx-auto text-gray-200 text-sm sm:text-base leading-relaxed px-2">
                Begin your journey with Bharatanatyam. Fill out the form below to start your enrollment process.
              </p>
            </TextAnimation>
          </div>
        </section>

        {/* Registration Content */}
        <section className="py-10 sm:py-12 md:py-16 lg:py-20 bg-[#8B0000]">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
              {/* Registration Form */}
              <div>
                <TextAnimation type="slide" direction="left" delay={0.2}>
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold font-headline mb-3 sm:mb-4 md:mb-6 text-white">Enrollment Form</h2>
                </TextAnimation>
                <TextAnimation type="fade" delay={0.4}>
                  <p className="text-gray-200 mb-4 sm:mb-6 md:mb-8 text-sm sm:text-base leading-relaxed">
                    Please provide your details below and we'll get back to you with enrollment information and next steps.
                  </p>
                </TextAnimation>
                <HoverAnimation effect="lift" tapEffect="scale">
                  <Card className="bg-card/80">
                    <CardContent className="p-3 sm:p-4 md:p-6">
                      <RegisterForm />
                    </CardContent>
                  </Card>
                </HoverAnimation>
              </div>

              {/* Admission Process */}
              <div>
                <TextAnimation type="slide" direction="right" delay={0.2}>
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold font-headline mb-3 sm:mb-4 md:mb-6 text-white">Admission Process</h2>
                </TextAnimation>
                <TextAnimation type="fade" delay={0.4}>
                  <p className="text-gray-200 mb-4 sm:mb-6 md:mb-8 text-sm sm:text-base leading-relaxed">
                    Our enrollment process is designed to ensure the best learning experience for every student.
                  </p>
                </TextAnimation>

                <StaggerContainer className="space-y-4 sm:space-y-6" delay={0.6}>
                  {admissionSteps.map((step, index) => (
                    <StaggerItem key={index} animation="slide" direction="up">
                      <HoverAnimation effect="lift" tapEffect="scale">
                        <Card className="bg-card/80">
                          <CardContent className="p-4 sm:p-6">
                            <div className="flex items-start gap-4">
                              <div className="bg-[#8B0000] text-white rounded-full h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center flex-shrink-0">
                                <step.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-base sm:text-lg mb-1 text-white">{step.title}</h3>
                                <p className="text-gray-200 text-sm sm:text-base leading-relaxed">{step.description}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </HoverAnimation>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
