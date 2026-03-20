import type { Page, PaginationQuery } from './pagination';

export type MailSource = 'RANDOM' | 'CUSTOM' | 'PURCHASED';

export type MailBox = {
  id: string;
  prefix: string;
  suffix: string;
  fullAddress: string;
};

export type MailBoxPurchase = MailBox & {
  balance: string;
};

export type MailItem = {
  prefix: string;
  suffix?: string | null;
};

export type RandomMailRequest = {
  suffix?: string | null;
  count?: number;
};

export type CustomMailRequest = {
  prefix: string;
  suffix?: string | null;
};

export type BatchBuyMailRequest = {
  items: MailItem[];
};

export type BindMailRequest = {
  mailBoxId?: string;
  fullAddress?: string;
  targetUserId: string;
};

export type RemoveMailRequest = {
  mailBoxId: string;
};

export type BatchRemoveMailRequest = {
  mailBoxIds: string[];
};

export type BatchBuyResult = {
  mailBoxes: MailBox[];
  totalAmount: string;
  balance: string;
};

export type BindMailResult = {
  id: string;
  fullAddress: string;
  userId: string;
  balance: string;
};

export type MailMessage = {
  id: string;
  subject: string;
  sender: string;
  receivedTime: string;
  contentText: string;
  contentHtml: string;
  isRead: 0 | 1;
};

export type MailMessagePage = Page<MailMessage>;

export type MailList = {
  id: string;
  fullAddress: string;
  messages: MailMessagePage;
};

export type MailMessageQuery = PaginationQuery & {
  mailBoxId: string;
  afterId?: string;
};

export type MailBoxStatusQuery = {
  mailBoxIds: string[];
};

export type MailBoxStatus = {
  mailBoxId: string;
  unreadCount: number;
  latestMessageId?: string | null;
};

export type MailStats = {
  total: number;
  today: number;
  mailBoxCount: number;
  todayMailBoxCount: number;
};

export type UserUnreadSummary = {
  totalUnread: number;
  unreadMailboxCount: number;
  updatedTime: string;
};

export type UserMailBox = {
  id: string;
  prefix: string;
  suffix: string;
  fullAddress: string;
  source: MailSource;
  createTime: string;
  unreadCount: number;
};

export type UserUnreadMailBox = UserMailBox & {
  latestMessageId?: string | null;
  latestReceivedTime?: string | null;
};

export type UserMailBoxQuery = PaginationQuery;

export type MailAnonymousQuota = {
  randomDaily: number;
  customDaily: number;
  randomUsed?: number;
  customUsed?: number;
};

export type MailQuotaConfig = {
  anonymous: MailAnonymousQuota;
};

export type MailPriceConfig = {
  buy: string;
  bind: string;
};

export type MailConfig = {
  quota: MailQuotaConfig;
  price: MailPriceConfig;
};

export type MailSuffix = {
  suffix: string;
  displayName: string;
  isDefault: boolean;
};

export type MarkReadRequest = {
  mailBoxId: string;
  messageIds: string[];
};

export type MarkReadResult = {
  success: boolean;
  updatedCount: number;
};
