import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { getIcon } from "../utils/iconUtils";
import MainFeature from "../components/MainFeature";

const CheckCircleIcon = getIcon('check-circle');
const ListChecksIcon = getIcon('list-checks');
const CalendarIcon = getIcon('calendar');
const TagIcon = getIcon('tag');
const ChevronRightIcon = getIcon('chevron-right');

const Home = () => {
  const [activeTab, setActiveTab] = useState('all');

  // Example task categories for demonstration
  const categories = [
    { id: 'personal', name: 'Personal', color: '#3b82f6', count: 5 },
    { id: 'work', name: 'Work', color: '#8b5cf6', count: 8 },
    { id: 'shopping', name: 'Shopping', color: '#f97316', count: 3 },
    { id: 'health', name: 'Health', color: '#10b981', count: 2 },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    toast.info(`Switched to ${tabId === 'all' ? 'All Tasks' : categories.find(c => c.id === tabId)?.name} view`);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
    {/* Sidebar */}
    <aside className="md:w-64 lg:w-72 flex-shrink-0">
        <div className="neu-card-light mb-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Categories</h2>
                <button
                    className="text-primary hover:text-primary-dark"
                    onClick={() => toast.info("Add category feature coming soon!")}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                </button>
            </div>
            <nav className="space-y-1">
                <button
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${activeTab === "all" ? "bg-primary/10 text-primary" : "hover:bg-surface-200 dark:hover:bg-surface-700"}`}
                    onClick={() => handleTabChange("all")}>
                    <div className="flex items-center gap-3">
                        <ListChecksIcon className="h-5 w-5" />
                        <span className="font-medium">All Tasks</span>
                    </div>
                    <span
                        className="bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-400 text-xs px-2 py-1 rounded-full">
                        {categories.reduce((sum, cat) => sum + cat.count, 0)}
                    </span>
                </button>
                {categories.map(category => <button
                    key={category.id}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${activeTab === category.id ? "bg-primary/10 text-primary" : "hover:bg-surface-200 dark:hover:bg-surface-700"}`}
                    onClick={() => handleTabChange(category.id)}>
                    <div className="flex items-center gap-3">
                        <span
                            className="h-4 w-4 rounded-full flex-shrink-0"
                            style={{
                                backgroundColor: category.color
                            }} />
                        <span className="font-medium">{category.name}</span>
                    </div>
                    <span
                        className="bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-400 text-xs px-2 py-1 rounded-full">
                        {category.count}
                    </span>
                </button>)}
            </nav>
        </div>
        <div className="neu-card-light hidden md:block">
            <div className="flex items-center gap-2 mb-2">
                <CheckCircleIcon className="text-accent h-5 w-5" />
                <h3 className="font-bold text-lg">Task Stats</h3>
            </div>
            <div className="space-y-3 mt-4">
                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-surface-600 dark:text-surface-400">Completed Today</span>
                        <span className="font-semibold">3 tasks</span>
                    </div>
                    <div
                        className="h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                        <div
                            className="bg-accent h-full rounded-full"
                            style={{
                                width: "30%"
                            }}></div>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-surface-600 dark:text-surface-400">Weekly Progress</span>
                        <span className="font-semibold">65%</span>
                    </div>
                    <div
                        className="h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                        <div
                            className="bg-primary h-full rounded-full"
                            style={{
                                width: "65%"
                            }}></div>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-surface-600 dark:text-surface-400">Monthly Goals</span>
                        <span className="font-semibold">42%</span>
                    </div>
                    <div
                        className="h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                        <div
                            className="bg-secondary h-full rounded-full"
                            style={{
                                width: "42%"
                            }}></div>
                    </div>
                </div>
            </div>
        </div>
    </aside>
    {/* Main content */}
    <main className="flex-grow">
        <AnimatePresence mode="wait">
            <motion.div
                key={activeTab}
                initial={{
                    opacity: 0,
                    y: 10
                }}
                animate={{
                    opacity: 1,
                    y: 0
                }}
                exit={{
                    opacity: 0,
                    y: -10
                }}
                transition={{
                    duration: 0.2
                }}
                className="h-full">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">
                        {activeTab === "all" ? "All Tasks" : categories.find(c => c.id === activeTab)?.name}
                    </h1>
                    <div className="flex gap-2">
                        <button className="btn-outline p-2">
                            <CalendarIcon className="h-5 w-5" />
                        </button>
                        <button className="btn-outline p-2">
                            <TagIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
                <div className="mb-8">
                    <MainFeature categoryId={activeTab} />
                </div>
                {/* Feature section */}
                {/* Feature section */}
                <div className="mt-12">
                    <h2 className="text-xl font-bold mb-6 flex items-center">
                        <span className="mr-2">Tasker Pro Features</span>
                        <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">Coming Soon</span>
                        <div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
                            {[{
                                icon: "calendar-clock",
                                title: "Time Tracking",
                                description: "Track time spent on each task"
                            }, {
                                icon: "repeat",
                                title: "Recurring Tasks",
                                description: "Set up tasks that repeat on schedule"
                            }, {
                                icon: "bell",
                                title: "Notifications",
                                description: "Get reminded about upcoming deadlines"
                            }, {
                                icon: "bar-chart-2",
                                title: "Productivity Reports",
                                description: "Analyze your productivity patterns"
                            }, {
                                icon: "users",
                                title: "Team Collaboration",
                                description: "Share and assign tasks with teammates"
                            }, {
                                icon: "layout-dashboard",
                                title: "Custom Dashboard",
                                description: "Personalize your task view"
                            }].map((feature, index) => {
                                const FeatureIcon = getIcon(feature.icon);

                                return (
                                    <motion.div
                                        key={index}
                                        className="card hover:shadow-soft cursor-pointer group h-full flex flex-col"
                                        whileHover={{
                                            y: -5
                                        }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 400,
                                            damping: 10
                                        }}>
                                        <div className="flex items-start gap-4">
                                            <div className="bg-primary/10 p-3 rounded-lg">
                                                <FeatureIcon className="h-6 w-6 text-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold mb-1 break-words">{feature.title}</h3>
                                                <p className="text-sm text-surface-600 dark:text-surface-400 break-words">
                                                    {feature.description}
                                                </p>
                                                <div
                                                    className="mt-2 flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span>Learn more</span>
                                                    <ChevronRightIcon className="h-4 w-4 ml-1" />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </h2></div>
            </motion.div>
        </AnimatePresence>
    </main>
</div>
  );
};

export default Home;