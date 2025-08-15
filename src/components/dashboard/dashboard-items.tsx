// // app/participant/dashboard/client-dashboard-items.tsx
// 'use client';

// import { submitClipAction } from '@/actions/auth-actions'; // Server action
// import { type Item } from '@prisma/client';
// import { useState } from 'react';

// interface Props {
//   items: Item[]; // All items available
//   obtainedItemIds: Set<string>; // IDs of items already obtained by the user
// }

// export default function ClientDashboardItems({ items, obtainedItemIds }: Props) {
//   const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
//   const [twitchClipUrl, setTwitchClipUrl] = useState('');
//   const [submissionStatusMessage, setSubmissionStatusMessage] = useState<string | null>(null);
//   const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

//   const handleClipSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedItemId || !twitchClipUrl) {
//       setSubmissionStatusMessage('Please select an item and provide a Twitch clip URL.');
//       setMessageType('error');
//       return;
//     }

//     setIsSubmitting(true);
//     setSubmissionStatusMessage(null);
//     setMessageType(null);

//     const formData = new FormData(e.currentTarget as HTMLFormElement);
//     formData.append('itemId', selectedItemId);
//     formData.append('twitchClipUrl', twitchClipUrl);

//     const result = await submitClipAction(formData);

//     if (result?.success) {
//       setSubmissionStatusMessage(result.message);
//       setMessageType('success');
//       setTwitchClipUrl('');
//       setSelectedItemId(null);
//       // Because submitClipAction calls revalidatePath, the parent Server Component
//       // will re-render on the next request, updating the checklist naturally.
//       // For immediate feedback on *this* client, you could also manually update the
//       // 'obtainedItemIds' state here, but relying on revalidatePath is cleaner.
//     } else if (result?.error) {
//       setSubmissionStatusMessage(result.error);
//       setMessageType('error');
//     }
//     setIsSubmitting(false);
//   };


//   return (
//     <>
//       <div className="md:col-span-2">
//         <h2 className="text-2xl font-semibold text-white mb-4">Available Items Checklist</h2>
//         <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
//           <ul className="space-y-4">
//             {items.map((item) => (
//               <li
//                 key={item.id}
//                 className={`p-4 rounded-md flex justify-between items-center ${
//                   obtainedItemIds.has(item.id)
//                     ? 'bg-green-700/50 border border-green-600'
//                     : 'bg-gray-700 border border-gray-600'
//                 }`}
//               >
//                 <div>
//                   <h3 className="text-xl font-medium text-white">
//                     {item.name} ({item.points} Points)
//                   </h3>
//                 </div>
//                 {obtainedItemIds.has(item.id) ? (
//                   <span className="text-green-400 font-bold">Obtained! ✅</span>
//                 ) : (
//                   <button
//                     type="button"
//                     onClick={() => setSelectedItemId(item.id)}
//                     className={`px-4 py-2 rounded-md transition-colors ${
//                       selectedItemId === item.id
//                         ? 'bg-blue-600 hover:bg-blue-700'
//                         : 'bg-indigo-600 hover:bg-indigo-700'
//                     } text-white font-semibold`}
//                   >
//                     {selectedItemId === item.id ? 'Selected' : 'Submit Clip'}
//                   </button>
//                 )}
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>

//       {/* Submission Form (this section can be extracted into its own Client Component) */}
//       <div className="md:col-span-1">
//         <h2 className="text-2xl font-semibold text-white mb-4">Submit Your Clip</h2>
//         <form onSubmit={handleClipSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-4">
//           <div>
//             <label htmlFor="itemSelect" className="block text-gray-300 text-sm font-bold mb-2">
//               Select Item:
//             </label>
//             <select
//               id="itemSelect"
//               name="itemId"
//               value={selectedItemId || ''}
//               onChange={(e) => setSelectedItemId(e.target.value)}
//               className="shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white"
//               required
//             >
//               <option value="">-- Choose an Item --</option>
//               {items
//                 .filter(item => !obtainedItemIds.has(item.id))
//                 .map((item) => (
//                   <option key={item.id} value={item.id}>
//                     {item.name}
//                   </option>
//                 ))}
//             </select>
//           </div>
//           <div>
//             <label htmlFor="clipUrl" className="block text-gray-300 text-sm font-bold mb-2">
//               Twitch Clip URL:
//             </label>
//             <input
//               type="url"
//               id="clipUrl"
//               name="twitchClipUrl"
//               value={twitchClipUrl}
//               onChange={(e) => setTwitchClipUrl(e.target.value)}
//               placeholder="e.g., https://clips.twitch.tv/..."
//               className="shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white"
//               required
//             />
//           </div>

//           {submissionStatusMessage && (
//             <p className={messageType === 'error' ? 'text-red-500 text-sm' : 'text-green-500 text-sm'}>
//               {submissionStatusMessage}
//             </p>
//           )}

//           <button
//             type="submit"
//             className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
//             disabled={isSubmitting || !selectedItemId || !twitchClipUrl}
//           >
//             {isSubmitting ? 'Submitting...' : 'Submit Clip for Review'}
//           </button>
//         </form>
//       </div>
//     </>
//   );
// }