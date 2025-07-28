"use client";

import { Loader2, Trash } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { DM_Sans } from "next/font/google";
import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { type TodoActionState, useTodoStore } from "@/lib/store";

const dmSans = DM_Sans({
	variable: "--font-dm-sans",
	subsets: ["latin"],
});

// Submit button component with loading state using useFormStatus
function SubmitButton() {
	const { pending } = useFormStatus();
	return (
		<Button
			type="submit"
			disabled={pending}
			className="sr-only" // Hidden but accessible
		>
			{pending ? <Loader2 className="animate-spin" /> : "Add Todo"}
		</Button>
	);
}

// Loading indicator for form submissions
function FormLoadingIndicator() {
	const { pending } = useFormStatus();
	if (!pending) return null;

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.8 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.8 }}
			className="absolute right-2 top-1/2 -translate-y-1/2"
		>
			<Loader2 className="h-4 w-4 animate-spin opacity-50" />
		</motion.div>
	);
}

export default function HomePage() {
	const {
		todos,
		addTodo,
		deleteTodo,
		toggleTodo,
		updateTodo,
		addTodoAction,
		deleteTodoAction,
		toggleTodoAction,
		updateTodoAction,
	} = useTodoStore();

	const [editingId, setEditingId] = useState<number | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const formRef = useRef<HTMLFormElement>(null);

	// React 19 useActionState for adding todos
	const initialState: TodoActionState = { success: false };
	const [addState, addFormAction] = useActionState(addTodoAction, initialState);

	// Reset form after successful submission
	useEffect(() => {
		if (addState.success && formRef.current) {
			formRef.current.reset();
			inputRef.current?.focus();
		}
	}, [addState]);

	const startEditing = (id: number) => {
		setEditingId(id);
	};

	const finishEditing = async (id: number, newText: string) => {
		if (newText.trim()) {
			await updateTodoAction(id, newText);
		}
		setEditingId(null);
	};

	// Optimistic action handlers using React 19 patterns
	const handleToggleTodo = async (id: number) => {
		// Optimistic update (toggle immediately for instant feedback)
		toggleTodo(id);
		try {
			// Then sync with action
			await toggleTodoAction(id);
		} catch (error) {
			// Revert on error (rollback optimistic update)
			toggleTodo(id);
		}
	};

	const handleDeleteTodo = async (id: number) => {
		// Optimistic delete (remove immediately for instant feedback)
		deleteTodo(id);
		try {
			// Then sync with action
			await deleteTodoAction(id);
		} catch (error) {
			// Could implement rollback here if needed
			console.error("Failed to delete todo:", error);
		}
	};

	useEffect(() => {
		if (editingId === null && inputRef.current) {
			inputRef.current.focus();
		}
	}, [editingId]);

	return (
		<div
			className={`${dmSans.variable} min-h-screen gap-8 flex justify-center items-center  text-left flex-col font-medium tracking-tighter`}
		>
			<motion.div
				className="w-full max-w-md flex justify-center flex-col p-8"
				initial={false}
				animate={{ gap: todos.length === 0 ? "1rem" : "4rem" }}
				transition={{ duration: 0.3 }}
			>
				<h1 className="text-2xl opacity-40 font-bold text-left flex items-start justify-start">
					{new Date().toISOString().split("T")[0]}
				</h1>
				<div className="flex gap-4 flex-col">
					<AnimatePresence initial={false}>
						{todos.map((todo) => (
							<motion.div
								key={todo.id}
								className="flex items-center justify-between space-x-2"
								layout
								initial={{ opacity: 0, y: 50, filter: "blur(20px)" }}
								animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
								exit={{ opacity: 0, y: 50, filter: "blur(20px)" }}
								transition={{ duration: 0.3 }}
							>
								<Checkbox
									checked={todo.completed}
									onCheckedChange={() => handleToggleTodo(todo.id)}
									className="mr-2 rounded-full size-6 border-2"
								/>
								{editingId === todo.id ? (
									<Input
										value={todo.text}
										className="border-t-0 border-r-0 border-l-0 focus-visible:outline-none focus-visible:ring-0 p-0 text-xl"
										onChange={(e) => {
											const newText = e.target.value;
											updateTodo(todo.id, newText);
										}}
										onBlur={() => finishEditing(todo.id, todo.text)}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												finishEditing(todo.id, todo.text);
											}
										}}
										autoFocus
									/>
								) : (
									<motion.span
										className="flex-grow group relative text-xl  overflow-clip text-ellipsis"
										onClick={() => startEditing(todo.id)}
										initial={false}
										animate={{
											opacity: todo.completed ? "60%" : "100%",
											textDecoration: todo.completed ? "line-through" : "none",
										}}
										transition={{ duration: 0.3 }}
									>
										{todo.text}
									</motion.span>
								)}
								<Button
									variant="ghost"
									className="rounded  flex transition-all "
									size="icon"
									onClick={() => handleDeleteTodo(todo.id)}
								>
									<Trash />
								</Button>
							</motion.div>
						))}
					</AnimatePresence>
				</div>

				<AnimatePresence initial={false}>
					<motion.div className="w-full max-w-md relative">
						<form ref={formRef} action={addFormAction}>
							<div className="relative">
								<Input
									ref={inputRef}
									name="todo"
									placeholder="Add a new todo"
									className="border-t-0 border-r-0 border-l-0 focus-visible:outline-none focus-visible:ring-0 text-xl pb-4 pr-8"
									autoComplete="off"
								/>
								<FormLoadingIndicator />
							</div>
							<SubmitButton />
						</form>
						{addState.error && (
							<motion.p
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								className="text-red-500 text-sm mt-2"
							>
								{addState.error}
							</motion.p>
						)}
					</motion.div>
				</AnimatePresence>
			</motion.div>
		</div>
	);
}
