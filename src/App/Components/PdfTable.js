import React from 'react';

const PdfTable = ({ items, subTotal, discount, vatAmount, total, currency, themeColor, layoutStyle }) => {
  const isSpreadsheet = layoutStyle === 'SPREADSHEET';
  const isStandardOrEU = items.length > 0 && items.some(item => item.vatPercent !== undefined);

  const themeHex = {
    'blue-800': '#1e40af',
    'green-700': '#047857',
    'purple-800': '#581c87',
  }[themeColor] || '#1e40af';

  const headers = isSpreadsheet
    ? ['#', 'Item & Description', 'Qty', 'Rate', 'Taxable Amount', 'VAT %', 'VAT', 'Total']
    : ['#', 'Item & Description', 'Qty', 'Rate', 'Discount', 'VAT %', 'VAT', 'Amount'];

  const colWidths = isSpreadsheet
    ? ['w-[5%]', 'w-[30%]', 'w-[10%]', 'w-[10%]', 'w-[15%]', 'w-[10%]', 'w-[10%]', 'w-[10%]']
    : ['w-[5%]', 'w-[30%]', 'w-[10%]', 'w-[15%]', 'w-[10%]', 'w-[10%]', 'w-[10%]', 'w-[10%]'];
// Bill Number Bill Date Bill Amount Payment Amount


    if (layoutStyle === 'ELITE') {
     return( <div className='my-8 border-b-2 border-gray-200 '>
        <h1 className='text-2xl font-bold text-black-400 mb-5'>Payment For</h1>
        <div className='flex justify-between items-start bg-gray-300'>
        <div className='m-2'>Bill Number</div>
        <div className='m-2'>Bill Date</div>
        <div className='m-2'>Bill Amount</div>
        <div className='m-2'>Payment Amount</div>
        </div>
        <div className='flex justify-between items-start mb-5 border-b-2 border-gray-200'>
        <div className='m-2'>4566</div>
        <div className='m-2'>24/10/2025</div>
        <div className='m-2'>3445</div>
        <div className='m-2'>3445</div>
        </div>
      </div>)
    }

  return (
    <div className="-mt-4">
      {/* Table Header */}
      <div
        className={`flex text-white font-semibold text-xs rounded-t ${isSpreadsheet ? ' text-black border border-gray-300' : ''}`}
        style={isSpreadsheet?{ backgroundColor: 'gray' }:{backgroundColor: themeHex} }
      >
        {headers.map((header, index) => (
          <div
            key={header}
            className={`py-2 px-3 ${colWidths[index]} ${
              isSpreadsheet ? 'border-r border-gray-300 last:border-r-0' : ''
            }`}
            style={{ textAlign: index < 2 ? 'left' : 'right' }}
          >
            {header}
          </div>
        ))}
      </div>

      {/* Table Body */}
      {items.map((item, index) => (
        <div
          key={item.id || index}
          className={`flex text-sm ${isSpreadsheet ? 'border-x border-b border-gray-300' : 'border-b border-gray-200'}`}
        >
          {/* # */}
          <div className={`py-2 px-3 ${colWidths[0]} ${isSpreadsheet ? 'border-r border-gray-300' : ''}`}>
            {index + 1}
          </div>

          {/* Item & Description */}
          <div className={`py-2 px-3 ${colWidths[1]} ${isSpreadsheet ? 'border-r border-gray-300' : ''}`}>
            <p className="font-medium">{item.description}</p>
            <p className="text-xs text-gray-500">{item.detail}</p>
            {item.unit && <p className="text-xs text-gray-500 mt-1">Unit: {item.unit}</p>}
          </div>

          {/* Qty */}
          <div className={`py-2 px-3 text-right ${colWidths[2]} ${isSpreadsheet ? 'border-r border-gray-300' : ''}`}>
            {item.qty.toFixed(2)}
          </div>

          {/* Rate */}
          <div className={`py-2 px-3 text-right ${colWidths[3]} ${isSpreadsheet ? 'border-r border-gray-300' : ''}`}>
            {currency} {item.rate.toFixed(2)}
          </div>

          {isSpreadsheet ? (
            <>
              {/* Taxable Amount */}
              <div className={`py-2 px-3 text-right ${colWidths[4]} border-r border-gray-300`}>
                {currency} {item.taxableAmount.toFixed(2)}
              </div>
              {/* VAT % */}
              <div className={`py-2 px-3 text-right ${colWidths[5]} border-r border-gray-300`}>
                {item.vatPercent}
              </div>
              {/* VAT */}
              <div className={`py-2 px-3 text-right ${colWidths[6]} border-r border-gray-300`}>
                {item.vat.toFixed(2)}
              </div>
              {/* Total */}
              <div className={`py-2 px-3 text-right font-semibold ${colWidths[7]}`}>
                {currency} {item.total.toFixed(2)}
              </div>
            </>
          ) : (
            <>
              {/* Discount */}
              <div className={`py-2 px-3 text-right ${colWidths[4]}`}>{item.discount.toFixed(2)}</div>
              {/* VAT % */}
              <div className={`py-2 px-3 text-right ${colWidths[5]}`}>{item.vatPercent}</div>
              {/* VAT */}
              <div className={`py-2 px-3 text-right ${colWidths[6]}`}>{item.vat.toFixed(2)}</div>
              {/* Amount */}
              <div className={`py-2 px-3 text-right font-semibold ${colWidths[7]}`}>
                {currency} {item.amount.toFixed(2)}
              </div>
            </>
          )}
        </div>
      ))}

      {/* Totals */}
      
        
        {isSpreadsheet ? (
          < div className={`flex text-sm ${isSpreadsheet ? 'border-x border-b border-gray-300' : 'border-b border-gray-200'}`}>
              {/* Taxable Amount */}
              <div className={`py-2 px-3 text-right mr-60 ${colWidths[4]} `}>
                
              </div>
              {/* VAT % */}
              <div className={`py-2 px-2 ml-1 text-right ${colWidths[5]} border-r border-gray-300`}>
                <span className="text-sm font-semibold">Sub Total</span>
              </div>
              {/* VAT */}
              <div className={`py-2 px-2 ml-10 text-right  ${colWidths[6]} border-r border-gray-300`}>
              <span className="text-sm ">{currency} {subTotal.toFixed(2)}</span>
              </div>
              {/* Total */}
              <div className={`py-2 px-3 text-right ml-20 ${colWidths[7]} border-r border-gray-300`}>
               <span className="text-sm ">{currency} {vatAmount.toFixed(2)}</span>
              </div>
              <div className={`py-2 px-3 text-right font-semibold ${colWidths[7]}`}>
               <span className="text-sm font-semibold">{currency} {total.toFixed(2)}</span>
              </div>
            </div>
        ) :
        (
          <div className="flex justify-end mt-4">
          <div className={`w-full sm:w-1/3 text-right`}>
          <div className="flex justify-between border-b border-gray-200 py-1 px-3">
            <span className="text-sm">Sub Total</span>
            <span className="text-sm font-semibold">{currency} {subTotal.toFixed(2)}</span>
          </div>
<div
            className="flex justify-between py-2 px-3  font-bold rounded-b"
            // style={isSpreadsheet?{ backgroundColor: 'gray' }:{backgroundColor: themeHex}}
          >
            <span>Total</span>
            <span>{currency} {total.toFixed(2)}</span>
          </div>
        </div>
      </div>
        )
        }
    </div>
  );
};

export default PdfTable;

//  {isSpreadsheet && (
//             <div className="flex justify-between border-b border-gray-200 py-1 px-3">
//               <span className="text-sm">Total VAT</span>
//               <span className="text-sm font-semibold">{currency} {vatAmount.toFixed(2)}</span>
//             </div>
//           )}