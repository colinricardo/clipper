import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Modal, atomOpenModals } from "@/frontend/stores/modals";
import { useAtom } from "jotai";
import { Rocket, Waves } from "lucide-react";
import { useState } from "react";

export default () => {
  const [activeModals, setActiveModals] = useAtom(atomOpenModals);
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    {
      title: "Welcome!",
      content: "Let's cover the basics before you jump in.",
      icon: Waves,
    },
    {
      title: "Ready to Go!",
      content: "You're all set to start!",
      icon: Rocket,
    },
  ];

  const closeModal = () => {
    setActiveModals(activeModals.filter((modal) => modal !== Modal.Onboarding));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      closeModal();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderContent = () => {
    const StepIcon = steps[currentStep - 1].icon;
    return (
      <Card className="shadow-none border-none w-full h-full flex flex-col justify-center items-center">
        <CardContent className="flex flex-col items-center justify-center">
          <div className="mb-8 bg-secondary rounded-full p-2 h-16 w-16 flex items-center justify-center">
            <StepIcon className="h-8 w-8 text-primary" />
          </div>
          <div className="h-24 flex items-center justify-center">
            <p className="text-lg text-center max-w-[80%]">
              {steps[currentStep - 1].content}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderFooter = () => (
    <DialogFooter className="mt-6 flex flex-col sm:flex-row gap-2">
      <Button
        variant="outline"
        onClick={handleBack}
        disabled={currentStep === 1}
        className="w-full sm:w-auto"
      >
        Back
      </Button>
      <Button onClick={handleNext} className="w-full sm:w-auto">
        {currentStep === steps.length ? "Get Started" : "Next"}
      </Button>
    </DialogFooter>
  );

  const renderMain = () => (
    <Dialog
      open={activeModals.includes(Modal.Onboarding)}
      onOpenChange={closeModal}
    >
      <DialogContent className="sm:max-w-[550px] h-[500px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {steps[currentStep - 1].title}
          </DialogTitle>
        </DialogHeader>
        <Progress value={(currentStep / steps.length) * 100} className="mt-2" />
        <div className="text-sm text-muted-foreground mt-2 text-center">
          Step {currentStep} of {steps.length}
        </div>
        <div className="flex-grow overflow-y-auto flex items-center justify-center">
          {renderContent()}
        </div>
        {renderFooter()}
      </DialogContent>
    </Dialog>
  );

  return renderMain();
};
