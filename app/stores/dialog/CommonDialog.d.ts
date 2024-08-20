export interface CommonDialog {
  visible: boolean;
  resolve?: (value?: any) => void; // default 값을 함수 또는 객체로 하면 @nuxt/devalue 에서 stringify 에러 발생.
  reject?: (value?: any) => void; // default 값을 함수 또는 객체로 하면 @nuxt/devalue 에서 stringify 에러 발생.
}
