import type * as React from 'react';
export type IconName = 'camera' | 'home' | 'session' | 'leaf' | 'break' | 'stash' | 'stats' | 'plus' | 'minus' | 'check' | 'lock' | 'calendar' | 'cloud' | 'chevron' | 'close' | 'alert' | 'clock';
export type Locale = 'en' | 'de' | 'pl' | (string & {});
export interface LocaleProviderProps { locale: Locale; children?: React.ReactNode }
export declare function LocaleProvider(props: LocaleProviderProps): React.ReactElement;
export declare function useLocale(): { locale: Locale; t(key: string, vars?: Record<string, string | number>): string; num(n: number, decimals?: number): string; pct(n: number, decimals?: number): string };
export type Messages = Record<string, string | { one?: string; few?: string; many?: string; other: string }>;
export declare const messages: Record<'en' | 'de' | 'pl', Messages>;
export declare function translate(locale: Locale, key: string, vars?: Record<string, string | number>): string;
export declare function formatNumber(locale: Locale, n: number, decimals?: number): string;
export declare function formatPercent(locale: Locale, n: number, decimals?: number): string;
export type StrainType = 'indica' | 'sativa' | 'hybrid' | 'cbd';
export interface IconProps { name: IconName; size?: number; filled?: boolean; title?: string; className?: string }
export declare function Icon(props: IconProps): React.ReactElement;
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?: 'primary' | 'secondary' | 'quiet' | 'danger'; size?: 'md' | 'lg'; icon?: IconName; block?: boolean }
export declare function Button(props: ButtonProps): React.ReactElement;
export interface ChipProps { selected?: boolean; defaultSelected?: boolean; onChange?: (selected: boolean) => void; disabled?: boolean; children: React.ReactNode }
export declare function Chip(props: ChipProps): React.ReactElement;
export interface SegmentedControlProps { options: { value: string; label: string; icon?: IconName }[]; value?: string; defaultValue?: string; onChange?: (value: string) => void; label: string }
export declare function SegmentedControl(props: SegmentedControlProps): React.ReactElement;
export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> { label: string; hint?: string; error?: string; suffix?: string; multiline?: boolean }
export declare function TextField(props: TextFieldProps): React.ReactElement;
export interface NumberFieldProps { label: string; value?: number; defaultValue?: number; onChange?: (value: number) => void; step?: number; min?: number; max?: number; decimals?: number; unit?: string; size?: 'md' | 'lg'; hint?: string; prefilled?: boolean; id?: string }
export declare function NumberField(props: NumberFieldProps): React.ReactElement;
export interface OptionGridProps { options: { value: string; label: string; icon?: IconName; media?: React.ReactNode; hint?: string }[]; value?: string | string[]; defaultValue?: string | string[]; onChange?: (value: any) => void; multiple?: boolean; columns?: 1 | 2 | 3; label: string }
export declare function OptionGrid(props: OptionGridProps): React.ReactElement;
export interface StepHeaderProps { step: number; total: number; title?: string; subtitle?: string; onClose?: () => void; closeLabel?: string }
export declare function StepHeader(props: StepHeaderProps): React.ReactElement;
export interface StepProps { stepKey?: React.Key; direction?: 'fwd' | 'back'; children: React.ReactNode }
export declare function Step(props: StepProps): React.ReactElement;
export interface ActionBarProps { primary?: string; onPrimary?: () => void; disabled?: boolean; secondary?: string | true; onSecondary?: () => void }
export declare function ActionBar(props: ActionBarProps): React.ReactElement;
export interface RatingProps { value?: number; defaultValue?: number; onChange?: (value: number) => void; max?: number; readOnly?: boolean; size?: number; label?: string }
export declare function Rating(props: RatingProps): React.ReactElement;
export interface StrainBadgeProps { type: StrainType; children?: React.ReactNode }
export declare function StrainBadge(props: StrainBadgeProps): React.ReactElement;
export interface StrainAvatarProps { name: string; type?: StrainType; src?: string; size?: 'sm' | 'md' | 'lg' | 'xl' | number; editable?: boolean; onPick?: (file: File) => void; className?: string }
export declare function StrainAvatar(props: StrainAvatarProps): React.ReactElement & { initials?: (name: string) => string };
export declare function prepareStrainPhoto(file: File, size?: number): Promise<Blob>;
export interface StatTileProps { label: string; value: string; unit?: string; trend?: number[]; note?: string; tone?: 'moss' | 'resin' | 'tide' }
export declare function StatTile(props: StatTileProps): React.ReactElement;
export interface BreakProgressProps { day: number; total?: number; since?: string; label?: string; action?: React.ReactNode }
export declare function BreakProgress(props: BreakProgressProps): React.ReactElement;
export interface SessionCardProps { time: string; ago?: string; strain: string; type?: StrainType; method?: string; amount?: string; setting?: string; effects?: string[]; note?: string; rating?: number; photo?: string }
export declare function SessionCard(props: SessionCardProps): React.ReactElement;
export interface StrainCardProps { name: string; type: StrainType; breeder?: string; thc?: number; cbd?: number; sessions?: number; inStash?: string; terpenes?: string[]; rating?: number; photo?: string }
export declare function StrainCard(props: StrainCardProps): React.ReactElement;
export interface NoticeProps { tone?: 'private' | 'backup' | 'info' | 'warn' | 'danger'; title?: string; children?: React.ReactNode; icon?: IconName; action?: React.ReactNode }
export declare function Notice(props: NoticeProps): React.ReactElement;
export interface TabBarProps { items?: { value: string; label: string; icon: IconName }[]; value?: string; defaultValue?: string; onChange?: (value: string) => void }
export declare function TabBar(props: TabBarProps): React.ReactElement;
declare global { interface Window { LightHead: { LocaleProvider: typeof LocaleProvider; useLocale: typeof useLocale; messages: typeof messages; translate: typeof translate; formatNumber: typeof formatNumber; formatPercent: typeof formatPercent; Icon: typeof Icon; Button: typeof Button; Chip: typeof Chip; SegmentedControl: typeof SegmentedControl; TextField: typeof TextField; NumberField: typeof NumberField; OptionGrid: typeof OptionGrid; StepHeader: typeof StepHeader; Step: typeof Step; ActionBar: typeof ActionBar; Rating: typeof Rating; StrainBadge: typeof StrainBadge; StrainAvatar: typeof StrainAvatar; prepareStrainPhoto: typeof prepareStrainPhoto; StatTile: typeof StatTile; BreakProgress: typeof BreakProgress; SessionCard: typeof SessionCard; StrainCard: typeof StrainCard; Notice: typeof Notice; TabBar: typeof TabBar } } }
