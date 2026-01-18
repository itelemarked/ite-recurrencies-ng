import { createAnimation } from "@ionic/angular";

export const slideInLeft = (baseEl: HTMLElement) => {
  const root = baseEl.shadowRoot;

  const backdropAnimation = createAnimation()
  backdropAnimation
    .addElement(root!.querySelector('ion-backdrop')!)
    .fromTo('opacity', '0.01', '1');

  const wrapperAnimation = createAnimation()
  wrapperAnimation
    .addElement(root!.querySelector('.modal-wrapper')!)
    .keyframes([
      { offset: 0, transform: 'translateX(100%)' },
      { offset: 1, transform: 'translateX(0)' },
    ]);

  return createAnimation()
    .addElement(baseEl)
    .easing('ease-out')
    .duration(200)
    .addAnimation([wrapperAnimation, backdropAnimation])
};

export const slideInRight = (baseEl: HTMLElement) => {
  const root = baseEl.shadowRoot;

  const backdropAnimation = createAnimation()
    backdropAnimation
    .addElement(root!.querySelector('ion-backdrop')!)
    .fromTo('opacity', '1', '0.01');

  const wrapperAnimation = createAnimation()
  wrapperAnimation
    .addElement(root!.querySelector('.modal-wrapper')!)
    .keyframes([
      { offset: 0, transform: 'translateX(0)' },
      { offset: 1, transform: 'translateX(100%)' },
    ]);

  return createAnimation()
    .addElement(baseEl)
    .easing('ease-out')
    .duration(200)
    .addAnimation([wrapperAnimation, backdropAnimation])
};