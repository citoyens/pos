type MenuItem = Array<{
  icon: string;
  module: string;
  navigateTo: string;
  roles: string[];
  title: string;
  shortTitle: string;
  navigateEquals: null;
}>;

export interface Menu {
  items: MenuItem;
}
