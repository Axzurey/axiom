export {};

declare global {
	type ValueOf<T> = T[keyof T]

	type InferThis<T> = T extends (this: infer U, ...parameters: Array<any>) => any ? U : never;

	type Parameters2<T> = T extends (...args: infer P) => any ? P : never;
	type ReturnType2<T> = T extends (...args: Array<any>) => infer R ? R : never;

	interface TypedPropertyDescriptor<T> {
		value: (self: InferThis<T>, ...parameters: Parameters2<T>) => ReturnType2<T>;
	}
}