import { TypeCard }     from '@/models/balance/enum/type-card.enum';

export const getCardTypeName = ( type: TypeCard ): string => ({
    [TypeCard.VISA]            : 'Visa',
    [TypeCard.VISA_ELECTRON]   : 'Visa Electron',
    [TypeCard.MASTERCARD]      : 'Mastercard',
    [TypeCard.AMERICAN_EXPRESS]: 'American Express',
    [TypeCard.DISCOVER]        : 'Discover',
    [TypeCard.JCB]             : 'JCB',
    [TypeCard.DINERS_CLUB]     : 'Diners Club',
    [TypeCard.UNIONPAY]        : 'UnionPay',
    [TypeCard.MAESTRO]         : 'Maestro',
    [TypeCard.ELO]             : 'Elo',
    [TypeCard.HIPERCARD]       : 'Hipercard',
    [TypeCard.AURA]            : 'Aura',
})[type] || 'Desconocido';