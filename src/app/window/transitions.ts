import { trigger, transition, style, animate, state } from "@angular/animations";

export const onOff =
    trigger('view', [
        transition(':enter',
            [
                style({ opacity: 0 }),
                animate('150ms ease-in',
                    style({ opacity: 1 }))
            ]
        ),
        // transition(':leave',
        //     [
        //         style({ opacity: 1 }),
        //         animate('50ms ease-in',
        //             style({ opacity: 0 }))
        //     ]
        // )
    ])

export const onAndOff =
    trigger('onAndOff', [
        transition(':enter',
            [
                style({ opacity: 0 }),
                animate('180ms ease-in',
                    style({ opacity: 1 }))
            ]
        ),
        transition(':leave',
            [
                style({ opacity: 1 }),
                animate('180ms ease-out',
                    style({ opacity: 0 }))
            ]
        )
    ])




export const editOn = trigger('editOn', [
    state('show', style({
        'opacity': '1'
    })),
    state('hide', style({
        'opacity': '0'
    })),
    transition('show => hide', animate('400ms ease')),
    transition('hide => show', animate('400ms ease'))
])



export const inOutAnimation = trigger('inOutAnimation', [
    transition(':enter',
        [
            style({ opacity: 0 }),
            animate('300ms ease-out',
                style({ opacity: 1 }))
        ]
    ),
    transition(':leave',
        [
            style({ height: 90, opacity: 1 }),
            animate('50ms ease-in',
                style({ height: 0, opacity: 0 }))
        ]
    )
])