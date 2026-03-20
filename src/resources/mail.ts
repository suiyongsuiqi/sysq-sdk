import type {
  BatchRemoveMailRequest,
  BatchBuyMailRequest,
  BatchBuyResult,
  BindMailRequest,
  BindMailResult,
  CustomMailRequest,
  MailBox,
  MailBoxPurchase,
  MailBoxStatus,
  MailBoxStatusQuery,
  MailConfig,
  MailList,
  MailMessageQuery,
  MarkReadRequest,
  MarkReadResult,
  MailStats,
  MailSuffix,
  RandomMailRequest,
  RemoveMailRequest,
  UserUnreadMailBox,
  UserUnreadSummary,
  UserMailBox,
  UserMailBoxQuery,
  Page,
} from '../contracts';
import type { SysqClient } from '../http/client';
import { toQueryString } from '../http/query-string';

const MAIL_PREFIX = '/v1/mail';

export function createMailApi(client: SysqClient) {
  return {
    createRandomMail(payload?: RandomMailRequest) {
      return client.post<MailBox>(`${MAIL_PREFIX}/passport/random`, payload, { skipAuth: true });
    },

    createCustomMail(payload: CustomMailRequest) {
      return client.post<MailBox>(`${MAIL_PREFIX}/passport/custom`, payload, { skipAuth: true });
    },

    purchaseMail(payload: CustomMailRequest) {
      return client.post<MailBoxPurchase>(`${MAIL_PREFIX}/buy`, payload);
    },

    purchaseRandomMail(payload?: RandomMailRequest) {
      return client.post<BatchBuyResult>(`${MAIL_PREFIX}/buy-random`, payload);
    },

    batchPurchaseMail(payload: BatchBuyMailRequest) {
      return client.post<BatchBuyResult>(`${MAIL_PREFIX}/batch-buy`, payload);
    },

    bindMailToAccount(payload: BindMailRequest) {
      return client.post<BindMailResult>(`${MAIL_PREFIX}/bind`, payload);
    },

    removeUserMail(payload: RemoveMailRequest) {
      return client.post<boolean>(`${MAIL_PREFIX}/remove`, payload);
    },

    batchRemoveUserMail(payload: BatchRemoveMailRequest) {
      return client.post<boolean>(`${MAIL_PREFIX}/batch-remove`, payload);
    },

    fetchMailList(payload: MailMessageQuery) {
      return client.post<MailList>(`${MAIL_PREFIX}/messages`, payload);
    },

    fetchMailBoxStatus(payload: MailBoxStatusQuery) {
      return client.post<MailBoxStatus[]>(`${MAIL_PREFIX}/passport/mailbox-status`, payload, {
        skipAuth: true,
      });
    },

    fetchMailStats() {
      return client.get<MailStats>(`${MAIL_PREFIX}/passport/stats`, { skipAuth: true });
    },

    fetchMailConfig() {
      return client.get<MailConfig>(`${MAIL_PREFIX}/passport/config`, { skipAuth: true });
    },

    fetchMailSuffixes() {
      return client.get<MailSuffix[]>(`${MAIL_PREFIX}/passport/suffixes`, { skipAuth: true });
    },

    fetchUserMailBoxes(query?: UserMailBoxQuery) {
      const qs = toQueryString(query);
      return client.get<Page<UserMailBox>>(`${MAIL_PREFIX}/user-list${qs}`);
    },

    fetchUserUnreadSummary() {
      return client.get<UserUnreadSummary>(`${MAIL_PREFIX}/user-unread-summary`);
    },

    fetchUserUnreadMailBoxes(query?: UserMailBoxQuery) {
      const qs = toQueryString(query);
      return client.get<Page<UserUnreadMailBox>>(`${MAIL_PREFIX}/user-unread-list${qs}`);
    },

    markMessagesRead(payload: MarkReadRequest) {
      return client.post<MarkReadResult>(`${MAIL_PREFIX}/mark-read`, payload);
    },
  };
}

export type MailApi = ReturnType<typeof createMailApi>;
