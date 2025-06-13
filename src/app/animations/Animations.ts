import { trigger, transition, style, animate, state, query, animateChild, group } from '@angular/animations';

export function pushUpDown() {
  return trigger('pushUpDown', [
    transition(':enter', [
      style({ transform: 'translateY(100%)' }),
      animate('600ms ease-out', style({ transform: 'translateY(0%)' }))
    ]),
    transition(':leave', [
      animate('600ms ease-in', style({ transform: 'translateY(-100%)' }))
    ])
  ]);
}


export function fadeInOut() {
  return  trigger('fadeInOut', [
    transition(':enter', [
      style({ opacity: 0 }),
      animate('300ms', style({ opacity: 1 }))
    ]),
    transition(':leave', [
      animate('300ms', style({ opacity: 0 }))
    ])
  ])
}


export function fadeInOut_Modal() {
  return  trigger('fadeInOut_Modal', [
    transition(':enter', [
      style({ opacity: 0 }),
      animate('1200ms', style({ opacity: 1 }))
    ]),
    transition(':leave', [
      animate('1200ms', style({ opacity: 0 }))
    ])
  ])
}

export const dropdownAnimation = trigger('dropdownAnimation', [
  state('closed', style({
    height: '0px',
    opacity: 0,
    overflow: 'hidden'
  })),
  state('open', style({
    height: '*',
    opacity: 1
  })),
  transition('closed => open', [
    style({ height: '0px', opacity: 0, overflow: 'hidden' }),
    animate('300ms ease-out', style({ height: '*', opacity: 1 }))
  ]),
  transition('open => closed', [
    style({ height: '*', opacity: 1 }),
    animate('300ms ease-in', style({ height: '0px', opacity: 0, overflow: 'hidden' }))
  ])
]);

export const slideInAnimation =
  trigger('routeAnimations', [
    transition('openClosePage <=> openClosePage', [
      style({position: 'relative'}),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
        }),
      ]),
      query(':enter', [style({left: '-100%'})], {optional: true}),
      query(':leave', animateChild(), {optional: true}),
      group([
        query(':leave', [animate('300ms ease-out', style({left: '100%'}))], {optional: true}),
        query(':enter', [animate('300ms ease-out', style({left: '0%'}))], {optional: true}),
      ]),
    ]),
    transition('* <=> *', [
      style({position: 'relative'}),
      query(
        ':enter, :leave',
        [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
          }),
        ],
        {optional: true},
      ),
      query(':enter', [style({left: '-100%'})], {optional: true}),
      query(':leave', animateChild(), {optional: true}),
      group([
        query(':leave', [animate('300ms ease-out', style({left: '100%', opacity: 0}))], {
          optional: true,
        }),
        query(':enter', [animate('300ms ease-out', style({left: '0%'}))], {optional: true}),
        query('@*', animateChild(), {optional: true}),
      ]),
    ]),
  ]);