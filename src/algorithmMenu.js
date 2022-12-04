import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function AlgorithmMenu({ algorithms, onChange, value }) {
    return (
        <Listbox value={value} onChange={onChange}>
            {({ open }) => (
                <div className="relative inline-block w-64 ">
                    <Listbox.Label className="block text-gray-700">algorithm</Listbox.Label>
                    <div className="relative mt-1 w-full">
                        <Listbox.Button className="relative inline-flex w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 sm:text-sm">
                            <span className="flex items-center">
                                <span className="block truncate">{value.name}</span>
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </span>
                        </Listbox.Button>

                        <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                <div className="divide-y divide-gray-200">
                                    {algorithms.map((group) => (
                                        <div>
                                            {group.map((algorithm) => (
                                                <Listbox.Option
                                                    key={algorithm.id}
                                                    className={({ active }) =>
                                                        classNames(
                                                            active ? 'text-white bg-violet-600' : 'text-gray-900',
                                                            'relative cursor-default select-none py-2 pl-3 pr-9'
                                                        )
                                                    }
                                                    value={algorithm}
                                                >
                                                    {({ selected, active }) => (
                                                        <>
                                                            {/* ?? */}
                                                            <div className="flex items-center">
                                                                <span
                                                                    className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}
                                                                >
                                                                    {algorithm.name}
                                                                </span>
                                                            </div>

                                                            {selected ? (
                                                                <span
                                                                    className={classNames(
                                                                        active ? 'text-white' : 'text-violet-600',
                                                                        'absolute inset-y-0 right-0 flex items-center pr-4'
                                                                    )}
                                                                >
                                                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                                </span>
                                                            ) : null}
                                                        </>
                                                    )}
                                                </Listbox.Option>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </Listbox.Options>
                        </Transition>
                    </div>
                </div>
            )}
        </Listbox>
    )
}



// import { Fragment } from 'react'
// import { Menu, Transition } from '@headlessui/react'
// import { ChevronDownIcon } from '@heroicons/react/20/solid'

// function classNames(...classes) {
//     return classes.filter(Boolean).join(' ')
// }

// export default function AlgorithmMenu() {
//     return (
//         <Menu as="div" className="relative inline-block text-left">
//             <div>
//                 <Menu.Button className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
//                     Options
//                     <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
//                 </Menu.Button>
//             </div>

//             <Transition
//                 as={Fragment}
//                 enter="transition ease-out duration-100"
//                 enterFrom="transform opacity-0 scale-95"
//                 enterTo="transform opacity-100 scale-100"
//                 leave="transition ease-in duration-75"
//                 leaveFrom="transform opacity-100 scale-100"
//                 leaveTo="transform opacity-0 scale-95"
//             >
//                 <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
//                     <div className="py-1">
//                         <Menu.Item>
//                             {({ active }) => (
//                                 <a
//                                     href="#"
//                                     className={classNames(
//                                         active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
//                                         'block px-4 py-2 text-sm'
//                                     )}
//                                 >
//                                     Breadth-First Search (BFS)
//                                 </a>
//                             )}
//                         </Menu.Item>
//                         <Menu.Item>
//                             {({ active }) => (
//                                 <a
//                                     href="#"
//                                     className={classNames(
//                                         active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
//                                         'block px-4 py-2 text-sm'
//                                     )}
//                                 >
//                                     Depth-First Search (DFS)
//                                 </a>
//                             )}
//                         </Menu.Item>
//                     </div>
//                     <div className="py-1">
//                         <Menu.Item>
//                             {({ active }) => (
//                                 <a
//                                     href="#"
//                                     className={classNames(
//                                         active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
//                                         'block px-4 py-2 text-sm'
//                                     )}
//                                 >
//                                     Dijkstra's Algorithm
//                                 </a>
//                             )}
//                         </Menu.Item>
//                         <Menu.Item>
//                             {({ active }) => (
//                                 <a
//                                     href="#"
//                                     className={classNames(
//                                         active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
//                                         'block px-4 py-2 text-sm'
//                                     )}
//                                 >
//                                     A* Algorithm
//                                 </a>
//                             )}
//                         </Menu.Item>
//                     </div>
//                     {/* <div className="py-1">
//                         <Menu.Item>
//                             {({ active }) => (
//                                 <a
//                                     href="#"
//                                     className={classNames(
//                                         active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
//                                         'block px-4 py-2 text-sm'
//                                     )}
//                                 >
//                                     Share
//                                 </a>
//                             )}
//                         </Menu.Item>
//                         <Menu.Item>
//                             {({ active }) => (
//                                 <a
//                                     href="#"
//                                     className={classNames(
//                                         active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
//                                         'block px-4 py-2 text-sm'
//                                     )}
//                                 >
//                                     Add to favorites
//                                 </a>
//                             )}
//                         </Menu.Item>
//                     </div>
//                     <div className="py-1">
//                         <Menu.Item>
//                             {({ active }) => (
//                                 <a
//                                     href="#"
//                                     className={classNames(
//                                         active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
//                                         'block px-4 py-2 text-sm'
//                                     )}
//                                 >
//                                     Delete
//                                 </a>
//                             )}
//                         </Menu.Item>
//                     </div> */}
//                 </Menu.Items>
//             </Transition>
//         </Menu>
//     )
// }