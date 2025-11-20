export interface ICompanyInfo {
  name: string;
  addressLine1: string;
  addressLine2: string;
  email: string;
  phone: string;
  contactNo: string;
}

export interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}