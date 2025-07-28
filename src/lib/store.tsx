"use client";

import React, {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import type { Todo } from "../types/todo";

interface TodoWithDate extends Todo {
	createdAt: string;
}

// Action state types for React 19
export interface TodoActionState {
	success: boolean;
	error?: string;
	todos?: TodoWithDate[];
}

interface TodoStore {
	todos: TodoWithDate[];
	addTodo: (text: string) => void;
	deleteTodo: (id: number) => void;
	toggleTodo: (id: number) => void;
	updateTodo: (id: number, text: string) => void;
	// New Action functions for React 19
	addTodoAction: (
		prevState: TodoActionState,
		formData: FormData,
	) => Promise<TodoActionState>;
	deleteTodoAction: (id: number) => Promise<TodoActionState>;
	toggleTodoAction: (id: number) => Promise<TodoActionState>;
	updateTodoAction: (id: number, text: string) => Promise<TodoActionState>;
}

const STORAGE_KEY = "todos-next-app";

// Helper functions for localStorage
const loadTodos = (): TodoWithDate[] => {
	if (typeof window === "undefined") return [];
	const saved = localStorage.getItem(STORAGE_KEY);
	return saved ? JSON.parse(saved) : [];
};

const saveTodos = (todos: TodoWithDate[]) => {
	if (typeof window === "undefined") return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
};

const TodoContext = createContext<TodoStore | undefined>(undefined);

export function TodoProvider({ children }: { children: ReactNode }) {
	const [todos, setTodos] = useState<TodoWithDate[]>([]);

	// Load todos from localStorage on initial render
	useEffect(() => {
		setTodos(loadTodos());
	}, []);

	// Save todos to localStorage whenever they change
	useEffect(() => {
		saveTodos(todos);
	}, [todos]);

	const addTodo = (text: string) => {
		const newTodo: TodoWithDate = {
			id: Date.now(),
			text: text.trim(),
			completed: false,
			createdAt: new Date().toISOString(),
		};
		setTodos((prev) => [...prev, newTodo]);
	};

	const deleteTodo = (id: number) => {
		setTodos((prev) => prev.filter((todo) => todo.id !== id));
	};

	const toggleTodo = (id: number) => {
		setTodos((prev) =>
			prev.map((todo) =>
				todo.id === id ? { ...todo, completed: !todo.completed } : todo,
			),
		);
	};

	const updateTodo = (id: number, text: string) => {
		setTodos((prev) =>
			prev.map((todo) =>
				todo.id === id ? { ...todo, text: text.trim() } : todo,
			),
		);
	};

	// React 19 Action functions
	const addTodoAction = async (
		prevState: TodoActionState,
		formData: FormData,
	): Promise<TodoActionState> => {
		try {
			const text = formData.get("todo") as string;
			if (!text || !text.trim()) {
				return { success: false, error: "Todo text is required" };
			}

			const newTodo: TodoWithDate = {
				id: Date.now(),
				text: text.trim(),
				completed: false,
				createdAt: new Date().toISOString(),
			};

			setTodos((prev) => {
				const newTodos = [...prev, newTodo];
				saveTodos(newTodos);
				return newTodos;
			});

			return { success: true };
		} catch (error) {
			return { success: false, error: "Failed to add todo" };
		}
	};

	const deleteTodoAction = async (id: number): Promise<TodoActionState> => {
		try {
			setTodos((prev) => {
				const newTodos = prev.filter((todo) => todo.id !== id);
				saveTodos(newTodos);
				return newTodos;
			});
			return { success: true };
		} catch (error) {
			return { success: false, error: "Failed to delete todo" };
		}
	};

	const toggleTodoAction = async (id: number): Promise<TodoActionState> => {
		try {
			setTodos((prev) => {
				const newTodos = prev.map((todo) =>
					todo.id === id ? { ...todo, completed: !todo.completed } : todo,
				);
				saveTodos(newTodos);
				return newTodos;
			});
			return { success: true };
		} catch (error) {
			return { success: false, error: "Failed to toggle todo" };
		}
	};

	const updateTodoAction = async (
		id: number,
		text: string,
	): Promise<TodoActionState> => {
		try {
			if (!text.trim()) {
				return { success: false, error: "Todo text cannot be empty" };
			}

			setTodos((prev) => {
				const newTodos = prev.map((todo) =>
					todo.id === id ? { ...todo, text: text.trim() } : todo,
				);
				saveTodos(newTodos);
				return newTodos;
			});
			return { success: true };
		} catch (error) {
			return { success: false, error: "Failed to update todo" };
		}
	};

	const value: TodoStore = {
		todos,
		addTodo,
		deleteTodo,
		toggleTodo,
		updateTodo,
		// React 19 Actions
		addTodoAction,
		deleteTodoAction,
		toggleTodoAction,
		updateTodoAction,
	};

	return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

export function useTodoStore(): TodoStore {
	const context = useContext(TodoContext);
	if (context === undefined) {
		throw new Error("useTodoStore must be used within a TodoProvider");
	}
	return context;
}
