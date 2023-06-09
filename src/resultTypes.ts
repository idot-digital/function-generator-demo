export type DefaultFunctionResults = {
  400: string; // default on request schema error
  401: string; // default on unauthorized
  500: string; // default on server error
};

export type FunctionResults = {
  [key: number]: object | null | string | number | boolean;
};
export type FunctionResponse<RES extends FunctionResults> = {
  [R in keyof RES]: { status: R; body: RES[R] };
}[keyof RES];

// ADD RESULT TYPES HERE
export type TemplateResult = DefaultFunctionResults & {
  200: string;
};
