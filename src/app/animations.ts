import { animate, animateChild, group, query, style, transition, trigger } from "@angular/animations";

export const abreFechaErro =
    trigger('abreFecha', [
        transition(':enter', [
            style({
                opacity: 0,
                transform: 'translateY(45%) scaleY(0.1)'
            }),
            animate('120ms ease', style({
                opacity: 1,
                transform: 'translateY(0) scaleY(1)'
            })),
        ]),
        transition(':leave', [
            style({
                opacity: 1,
                transform: 'translateY(0) scaleY(1)'
            }),
            animate('120ms ease', style({
                opacity: 0,
                transform: 'translateY(50%) scaleY(0)'
            }))
        ])
    ])


export const abreFecha =
    trigger('abreFecha', [
        transition('HomePage <=> *', [
            // style({
            //     // position: 'relative',

            // }),
            query(':enter, :leave', [
                style({
                    position: 'absolute',
                    width: '100%'
                    // position: 'absolute',
                    // left: '1px',
                    // top: 0,
                    // left: 0

                })
            ], { optional: true }),
            query(':enter', [
                style({
                    transform: 'translateY(40%) scaleY(0.2)',
                    opacity: 0,
                })
            ], { optional: true }),
            query(':leave', [
                style({
                    transform: 'translateY(0) scaleY(1)',
                    opacity: 1,
                })
            ], { optional: true }),
            // group([
            query(':leave', [
                animate('190ms ease-out', style({
                    // left: '100%';
                    transform: 'translateY(40%) scaleY(0.2)',
                    opacity: 0,

                }))
            ], { optional: true }),
            query(':enter', [
                animate('18ms ease-out', style({
                    transform: 'translateY(0) scaleY(1)',
                    opacity: 1,
                    // left: '0%'
                }))
            ], { optional: true }),


            // ]),
        ]),
        // transition('* <=> *', [
        //     style({ position: 'relative' }),
        //     query(':enter, :leave', [
        //         style({
        //             position: 'absolute',
        //             top: 0,
        //             left: 0,
        //             width: '100%'
        //         })
        //     ], { optional: true }),
        //     query(':enter', [
        //         style({ left: '-100%' })
        //     ], { optional: true }),
        //     query(':leave', animateChild(), { optional: true }),
        //     group([
        //         query(':leave', [
        //             animate('200ms ease-out', style({ left: '100%', opacity: 0 }))
        //         ], { optional: true }),
        //         query(':enter', [
        //             animate('300ms ease-out', style({ left: '0%' }))
        //         ], { optional: true }),
        //         query('@*', animateChild(), { optional: true })
        //     ]),
        // ])
    ]);

export const abreFechaErrodois =
    trigger('abreFechaErrodois', [
        transition('HomePage <=> *', [
            style({ position: 'relative' }),
            // query(':enter, :leave', [
            //     style({
            //         opacity: 0,
            //         transform: 'scaleY(0) translateY(100%)'
            //     })
            // ]),
            query(':enter', [
                style({
                    opacity: 0,
                    transform: 'scaleY(0) translateY(100%)'
                })
            ]),
            query(':enter', [
                animate('600ms ease',
                    style({
                        opacity: 1,
                        transform: 'scaleY(10) translateY(100%)'
                    })
                )]),
            query(':leave', [
                style({
                    opacity: 1,
                    transform: 'scaleY(1) translateY(0)'
                })
            ]),
            query(':leave', [
                animate('1800ms ease',
                    style({
                        opacity: 0,
                        transform: 'scaleY(0) translateY(100%)'
                    })
                )]),
            // group([
            //     query(':leave', [
            //         animate('200ms ease-out', style({ left: '100%', opacity: 0 }))
            //     ]),
            //     query(':enter', [
            //         animate('300ms ease-out', style({ left: '0%' }))
            //     ]),
            //     query('@*', animateChild())
            // ]),
        ]),



        // transition('WindowPage <=> *', [
        //     // style({ position: 'relative' }),
        //     // query(':enter, :leave', [
        //     //     style({
        //     //         opacity: 0,
        //     //         transform: 'scaleY(0) translateY(100%)'
        //     //     })
        //     // ]),
        //     query(':leave', [
        //         style({
        //             opacity: 1,
        //             transform: 'scaleY(1) translateY(0)'
        //         })
        //     ]),
        //     query(':leave', [
        //         animate('600ms ease',
        //             style({
        //                 opacity: 0,
        //                 transform: 'scaleY(0) translateY(100%)'
        //             })
        //         )])
        // ]),
        // query(':leave', animateChild(), { optional: true }),
        // group([
        //     query(':leave', [
        //         animate('200ms ease-out', style({ left: '100%', opacity: 0 }))
        //     ]),
        //     query(':enter', [
        //         animate('300ms ease-out', style({ left: '0%' }))
        //     ]),
        //     query('@*', animateChild())
        // ]),

        //     style({
        //     opacity: 0,
        //     transform: 'translateY(45%) scaleY(0.1)'
        // }),
        // animate('120ms ease', style({
        //     opacity: 1,
        //     transform: 'translateY(0) scaleY(1)'
        // })),
        // ]),
        // transition(':leave', [
        //     style({
        //         opacity: 1,
        //         transform: 'translateY(0) scaleY(1)'
        //     }),
        //     animate('120ms ease', style({
        //         opacity: 0,
        //         transform: 'translateY(50%) scaleY(0)'
        //     }))
        // ])
    ])


export const slideInAnimation =
    trigger('routeAnimations', [
        transition('HomePage <=> AboutPage', [
            style({ position: 'relative' }),
            query(':enter, :leave', [
                style({
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%'
                })
            ]),
            query(':enter', [
                style({ left: '-100%' })
            ]),
            query(':leave', animateChild()),
            group([
                query(':leave', [
                    animate('300ms ease-out', style({ left: '100%' }))
                ]),
                query(':enter', [
                    animate('300ms ease-out', style({ left: '0%' }))
                ]),
            ]),
        ]),
        transition('* <=> *', [
            style({ position: 'relative' }),
            query(':enter, :leave', [
                style({
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%'
                })
            ]),
            query(':enter', [
                style({ left: '-100%' })
            ]),
            query(':leave', animateChild()),
            group([
                query(':leave', [
                    animate('200ms ease-out', style({ left: '100%', opacity: 0 }))
                ]),
                query(':enter', [
                    animate('300ms ease-out', style({ left: '0%' }))
                ]),
                query('@*', animateChild())
            ]),
        ])
    ]);