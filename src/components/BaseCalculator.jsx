import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { AlertCircle } from 'lucide-react';

const BaseCalculator = () => {
 const [input, setInput] = useState('');
 const [fromBase, setFromBase] = useState('10');
 const [toBase, setToBase] = useState('2');
 const [steps, setSteps] = useState([]);
 const [result, setResult] = useState('');
 const [error, setError] = useState('');

 const validateInput = (input, base) => {
   const basePatterns = {
     2: /^[0-1]+$/,
     8: /^[0-7]+$/,
     10: /^[0-9]+$/,
     16: /^[0-9A-F]+$/i
   };

   if (!basePatterns[base].test(input)) {
     throw new Error(`Aksara tidak sah untuk asas ${base}`);
   }

   if (input.length > 7) {
     throw new Error('Panjang nombor melebihi 7 digit');
   }
 };

 const createPlaceValueTable = (number, base) => {
   const digits = number.split('');
   const numDigits = digits.length;
   const totalSum = [];

   return (
     <div className="overflow-x-auto bg-white rounded-lg shadow-sm p-4 my-4">
       <table className="w-full border-collapse">
         <thead>
           <tr>
             <th className="border p-2 bg-blue-500 text-white">Kedudukan</th>
             {digits.map((_, i) => (
               <th key={i} className="border p-2 bg-blue-500 text-white">
                 {base}<sup>{numDigits - 1 - i}</sup>
               </th>
             ))}
           </tr>
         </thead>
         <tbody>
           <tr>
             <td className="border p-2 font-medium">Digit</td>
             {digits.map((digit, i) => (
               <td key={i} className="border p-2 text-center bg-orange-100">{digit}</td>
             ))}
           </tr>
           <tr>
             <td className="border p-2 font-medium">Hasil</td>
             {digits.map((digit, i) => {
               const power = numDigits - 1 - i;
               const value = parseInt(digit, base) * Math.pow(base, power);
               totalSum.push(value);
               return (
                 <td key={i} className="border p-2 text-center bg-orange-200 text-orange-900">
                   {value}
                 </td>
               );
             })}
           </tr>
         </tbody>
       </table>
       <div className="text-right font-mono bg-purple-100 p-2 mt-4 rounded border border-purple-300 text-purple-900">
         Jumlah = {totalSum.join(' + ')}
       </div>
     </div>
   );
 };

 const createDivisionSteps = (steps) => (
   <div className="overflow-x-auto bg-white rounded-lg shadow-sm p-4 my-4">
     <table className="mx-auto">
       <tbody>
         {steps.map((step, i) => (
           <tr key={i} className="font-mono">
             <td className="px-3 py-1">{step.quotient}</td>
             <td className="px-3 py-1">÷</td>
             <td className="px-3 py-1">{toBase}</td>
             <td className="px-3 py-1">=</td>
             <td className="px-3 py-1">{step.nextQuotient}</td>
             <td className="px-3 py-1">baki</td>
             <td className="px-3 py-1 text-red-700 font-bold">{step.remainder}</td>
           </tr>
         ))}
       </tbody>
     </table>
   </div>
 );

 const convertNumber = () => {
   try {
     if (!input) {
       throw new Error('Sila masukkan nombor');
     }

     const fromBaseInt = parseInt(fromBase);
     const toBaseInt = parseInt(toBase);
     const newSteps = [];

     validateInput(input.toUpperCase(), fromBaseInt);

     newSteps.push({
       type: 'title',
       content: `Menukar ${input} daripada Asas-${fromBaseInt} kepada Asas-${toBaseInt}`
     });

     let decimal;
     if (fromBaseInt !== 10) {
       newSteps.push({
         type: 'subtitle',
         content: 'Langkah 1: Tukar kepada Perpuluhan'
       });
       newSteps.push({
         type: 'table',
         content: { number: input, base: fromBaseInt }
       });

       decimal = parseInt(input, fromBaseInt);
       newSteps.push({
         type: 'text',
         content: `Nilai perpuluhan = ${decimal}`
       });
     } else {
       decimal = parseInt(input);
       newSteps.push({
         type: 'text',
         content: `Nombor sudah dalam perpuluhan: ${decimal}`
       });
     }

     if (toBaseInt !== 10) {
       if (decimal === 0) {
         setResult('0');
         newSteps.push({
           type: 'text',
           content: `Hasil akhir = 0 (Asas-${toBaseInt})`
         });
         setSteps(newSteps);
         return;
       }

       newSteps.push({
         type: 'subtitle',
         content: `Langkah 2: Tukar ${decimal} kepada Asas-${toBaseInt}`
       });

       let quotient = decimal;
       let remainders = [];
       let divisionSteps = [];

       while (quotient > 0) {
         const remainder = quotient % toBaseInt;
         remainders.unshift(remainder < 10 ? remainder : String.fromCharCode(55 + remainder));
         divisionSteps.push({
           quotient,
           remainder,
           nextQuotient: Math.floor(quotient / toBaseInt)
         });
         quotient = Math.floor(quotient / toBaseInt);
       }

       newSteps.push({
         type: 'division',
         content: divisionSteps
       });

       const finalResult = remainders.join('');
       setResult(finalResult);
       newSteps.push({
         type: 'text',
         content: `Hasil = ${finalResult} (Asas-${toBaseInt})`
       });
     } else {
       setResult(decimal.toString());
       newSteps.push({
         type: 'text',
         content: `Hasil akhir = ${decimal} (Asas-${toBaseInt})`
       });
     }

     setSteps(newSteps);
     setError('');
   } catch (err) {
     setError(err.message);
     setResult('Ralat');
     setSteps([]);
   }
 };

 return (
   <div className="min-h-screen bg-gradient-to-br from-cyan-100 to-blue-200 p-4">
     <div className="container mx-auto max-w-4xl">
       <Card className="shadow-lg">
         <CardHeader className="bg-gradient-to-r from-orange-400 to-amber-500">
           <CardTitle className="text-white text-center text-2xl">Kalkulator Nombor Asas</CardTitle>
         </CardHeader>
         <CardContent className="p-6">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
             <div>
               <label className="block text-sm font-medium mb-2">Dari Asas:</label>
               <select
                 value={fromBase}
                 onChange={(e) => {
                   setFromBase(e.target.value);
                   setInput('');
                   setResult('');
                   setSteps([]);
                 }}
                 className="w-full p-2 border rounded-md bg-white text-black"
               >
                 <option value="2">Binari (2)</option>
                 <option value="8">Oktal (8)</option>
                 <option value="10">Perpuluhan (10)</option>
                 <option value="16">Heksadesimal (16)</option>
               </select>
             </div>
             <div>
               <label className="block text-sm font-medium mb-2">Ke Asas:</label>
               <select
                 value={toBase}
                 onChange={(e) => setToBase(e.target.value)}
                 className="w-full p-2 border rounded-md bg-white text-black"
               >
                 <option value="2">Binari (2)</option>
                 <option value="8">Oktal (8)</option>
                 <option value="10">Perpuluhan (10)</option>
                 <option value="16">Heksadesimal (16)</option>
               </select>
             </div>
             <div className="lg:col-span-2">
               <label className="block text-sm font-medium mb-2">Masukkan Nombor:</label>
               <input
                 type="text"
                 value={input}
                 onChange={(e) => setInput(e.target.value.toUpperCase())}
                 className="w-full p-2 border rounded-md bg-white text-black"
                 placeholder="Masukkan nombor (maksimum 7 digit)"
                 maxLength={7}
               />
             </div>
           </div>

           <button
             onClick={convertNumber}
             className="w-full md:w-auto px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md hover:from-blue-600 hover:to-blue-700 transition-colors mb-6"
           >
             Tukar & Tunjukkan Langkah
           </button>

           {error && (
             <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-4 flex items-center">
               <AlertCircle className="text-red-500 mr-2" />
               <p className="text-red-700">{error}</p>
             </div>
           )}

           {result && (
             <div className="mb-6">
               <label className="block text-sm font-medium mb-2">Hasil:</label>
               <input
                 type="text"
                 value={result}
                 readOnly
                 className="w-full p-2 border rounded-md bg-white text-black"
               />
             </div>
           )}

           <div className="space-y-4">
             {steps.map((step, index) => {
               switch (step.type) {
                 case 'title':
                   return (
                     <div key={index} className="bg-blue-50 p-4 rounded-lg">
                       <h3 className="text-lg font-semibold text-center">{step.content}</h3>
                     </div>
                   );
                 case 'subtitle':
                   return (
                     <div key={index} className="bg-gray-50 p-4 rounded-lg">
                       <h4 className="text-md font-medium text-center">{step.content}</h4>
                     </div>
                   );
                 case 'table':
                   return <div key={index}>{createPlaceValueTable(step.content.number, step.content.base)}</div>;
                 case 'division':
                   return <div key={index}>{createDivisionSteps(step.content)}</div>;
                 case 'text':
                   return (
                     <div key={index} className="bg-green-50 p-4 rounded-lg">
                       <p className="text-center">{step.content}</p>
                     </div>
                   );
                 default:
                   return null;
               }
             })}
           </div>
         </CardContent>
       </Card>
     </div>
   </div>
 );
};

export default BaseCalculator;