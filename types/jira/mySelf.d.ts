export interface JiraMySelf {
  self: string;
  accountId: string;
  accountType: string;
  emailAddress: string;
  avatarUrls: {
    [key: string]: string;
  };
  displayName: string;
  active: boolean;
  timeZone: string;
  locale: string;
  groups: {
    size: number;
    items: string[];
  };
  applicationRoles: {
    size: number;
    items: string[];
  };
  expand: string;
}
