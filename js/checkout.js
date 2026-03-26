const CheckoutFlow = {
    currentStep: 1,
    nextStep: () => {
        const btn = document.getElementById('checkout-action-btn');

        if (CheckoutFlow.currentStep === 1) {
            document.getElementById('step-1-content').classList.add('hidden');
            document.getElementById('step-2-content').classList.remove('hidden');
            const step2Icon = document.getElementById('progress-step-2');
            step2Icon.classList.remove('border-gray-200', 'text-primary', 'bg-[#F7FAFC]');
            step2Icon.classList.add('border-primary', 'bg-primary', 'text-white');
            document.getElementById('progress-text-2').classList.replace('text-gray-500', 'text-primary');
            
            btn.innerText = 'Перейти к оплате';
            CheckoutFlow.currentStep = 2;

        } else if (CheckoutFlow.currentStep === 2) {
            document.getElementById('step-2-content').classList.add('hidden');
            document.getElementById('step-3-content').classList.remove('hidden');
            const step3Icon = document.getElementById('progress-step-3');
            step3Icon.classList.remove('border-gray-200', 'text-gray-400', 'bg-[#F7FAFC]');
            step3Icon.classList.add('border-primary', 'bg-primary', 'text-white');
            document.getElementById('progress-text-3').classList.replace('text-gray-400', 'text-primary');
            
            btn.innerText = 'Оплатить $687.32';
            CheckoutFlow.currentStep = 3;

        } else if (CheckoutFlow.currentStep === 3) {
            document.getElementById('step-3-content').classList.add('hidden');
            document.getElementById('step-4-content').classList.remove('hidden');
            document.getElementById('checkout-sidebar').classList.add('hidden');
            const mainColumn = document.getElementById('main-checkout-column');
            mainColumn.classList.replace('lg:col-span-8', 'lg:col-span-12');
            const step4Icon = document.getElementById('progress-step-4');
            step4Icon.classList.remove('border-gray-200', 'text-gray-400', 'bg-[#F7FAFC]');
            step4Icon.classList.add('border-primary', 'bg-primary', 'text-white');
            document.getElementById('progress-text-4').classList.replace('text-gray-400', 'text-primary');
            
            CheckoutFlow.currentStep = 4;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
};