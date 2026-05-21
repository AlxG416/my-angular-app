export interface IUser {
  id: number;
  name: string;
  username: string;
  email: string;
  phone?: string;
  website?: string;
  company?: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
  address?: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo?: {
      lat: string;
      lng: string;
    };
  };
  createdAt?: Date,
  updatedAt?: Date
}

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type DeepPartialIUser = DeepPartial<IUser>;

export const userPattern = {
  id: 0,
  name: '',
  username: '',
  email: '',
  phone: '',
  website: '',
  company: {
    name: '',
    catchPhrase: '',
    bs: ''
  },
  address: {
    street: '',
    suite: '',
    city: '',
    zipcode: '',
    geo: {
        lat: '',
        lng: ''
    }
  }
}

export interface FrmField {
  id: number;
  label: string;
  name: string;
  controlName: string;
  inputType: string;
  placeholder: string;
  required: boolean;
  errorTip?: string;
}