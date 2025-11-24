"use client";

import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

interface Todo {
    id: number;
    title: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
}

export default function Home() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [title, setTitle] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const todosPerPage = 10;

    const fetchTodos = async () => {
        try {
            const res = await axios.get("http://localhost:4000/todos");
            setTodos(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const addTodo = async () => {
        if (!title) return;
        await axios.post("http://localhost:4000/todos", { title });
        setTitle("");
        fetchTodos();
    };

    const toggleTodo = async (id: number, completed: boolean) => {
        await axios.put(`http://localhost:4000/todos/${id}`, { completed: !completed });
        fetchTodos();
    };

    const deleteTodo = async (id: number) => {
        await axios.delete(`http://localhost:4000/todos/${id}`);
        fetchTodos();
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    // Pagination logic
    const indexOfLastTodo = currentPage * todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
    const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);
    const totalPages = Math.ceil(todos.length / todosPerPage);

    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="card shadow-lg w-100" style={{ maxWidth: "900px" }}>
                <div className="card-body">
                    <h2 className="text-center mb-4 fw-bold">Todo App</h2>

                    {/* Input */}
                    <div className="input-group mb-4">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Add new task..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <button className="btn btn-primary" onClick={addTodo}>
                            Add
                        </button>
                    </div>

                    {/* Table */}
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped text-center align-middle">
                            <thead className="table-dark">
                                <tr>
                                    <th>#</th>
                                    <th>Task</th>
                                    <th>Created At</th>
                                    <th>Updated At</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {currentTodos.map((todo, index) => (
                                    <tr key={todo.id}>
                                        <td>{indexOfFirstTodo + index + 1}</td>
                                        <td
                                            style={{ cursor: "pointer" }}
                                            onClick={() => toggleTodo(todo.id, todo.completed)}
                                            className={todo.completed ? "text-decoration-line-through text-muted" : ""}
                                        >
                                            {todo.title}
                                        </td>
                                        <td>{new Date(todo.createdAt).toLocaleString()}</td>
                                        <td>{new Date(todo.updatedAt).toLocaleString()}</td>
                                        <td>
                                            <span
                                                className={`badge ${todo.completed ? "bg-success" : "bg-warning text-dark"
                                                    }`}
                                            >
                                                {todo.completed ? "YES" : "NO"}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => deleteTodo(todo.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {currentTodos.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="text-muted py-3">
                                            No tasks found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <nav aria-label="Todo pagination" className="mt-3">
                            <ul className="pagination justify-content-center">
                                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                    <button className="page-link" onClick={() => goToPage(currentPage - 1)}>
                                        Previous
                                    </button>
                                </li>

                                {Array.from({ length: totalPages }, (_, i) => (
                                    <li
                                        key={i}
                                        className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                                    >
                                        <button className="page-link" onClick={() => goToPage(i + 1)}>
                                            {i + 1}
                                        </button>
                                    </li>
                                ))}

                                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                    <button className="page-link" onClick={() => goToPage(currentPage + 1)}>
                                        Next
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    )}
                </div>
            </div>
        </div>
    );
}
