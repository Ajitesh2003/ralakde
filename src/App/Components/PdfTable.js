import React from 'react';

const PdfTable = ({ items, subTotal, discount, vatAmount, total, currency, themeColor, layoutStyle, tableConfig, totalConfig }) => {
  const isSpreadsheet = layoutStyle === 'SPREADSHEET';

  // Use default configuration if tableConfig is not provided
  const config = tableConfig || {
    columns: [
      { id: 'lineItemNumber', field: 'index', label: '#', visible: true, width: 5 },
      { id: 'item', field: 'description', label: 'Item & Description', visible: true, width: 35 },
      { id: 'quantity', field: 'qty', label: 'Qty', visible: true, width: 10, showUnit: false },
      { id: 'rate', field: 'rate', label: 'Rate', visible: true, width: 10 },
      { id: 'taxableAmount', field: 'taxableAmount', label: 'Taxable Amount', visible: true, width: 11 },
      { id: 'vatRate', field: 'vatPercent', label: 'VAT %', visible: true, width: 9 },
      { id: 'vatAmount', field: 'vat', label: 'VAT', visible: true, width: 9 },
      { id: 'discount', field: 'discount', label: 'Discount', visible: true, width: 11 },
      { id: 'amount', field: 'amount', label: 'Total', visible: true, width: 10, addTaxToAmount: false }
    ],
    borderColor: '#adadad',
    headerFontSize: 9,
    headerBackgroundColor: '#064384',
    headerFontColor: '#ffffff',
    rowFontSize: 9,
    rowBackgroundColor: '#ffffff',
    rowFontColor: '#000000',
    descriptionFontSize: 8,
    descriptionFontColor: '#333333'
  };

  // Use default configuration if totalConfig is not provided
  const totalsConfig = totalConfig || {
    showTotalSection: true,
    subTotal: { visible: true, label: 'Sub Total' },
    discount: { visible: true, label: 'Discount' },
    taxDetails: { visible: true, label: 'VAT' },
    total: { visible: true, label: 'Total' },
    currencyPosition: 'before',
    showQuantity: false,
    showAmountInWords: false,
    totalSectionFontSize: 10,
    totalSectionFontColor: '#000000',
    totalSectionBgEnabled: false,
    totalSectionBgColor: '#ffffff',
    balanceDueFontSize: 12,
    balanceDueFontColor: '#000000',
    balanceDueBgEnabled: false,
    balanceDueBgColor: '#f7f8f5'
  };

  // Filter visible columns
  const visibleColumns = config.columns.filter(col => col.visible);

  // Helper function to format currency
  const formatCurrency = (amount) => {
    const formattedAmount = `${currency} ${amount.toFixed(2)}`;
    return totalsConfig.currencyPosition === 'after'
      ? `${amount.toFixed(2)} ${currency}`
      : formattedAmount;
  };

  // Elite layout (special case)
  if (layoutStyle === 'ELITE') {
    return (
      <div className='my-8 border-b-2 border-gray-200'>
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
      </div>
    );
  }

  // Helper function to render cell content based on field type
  const renderCellContent = (column, item, index) => {
    const { field, id } = column;

    switch (id) {
      case 'lineItemNumber':
        return index + 1;

      case 'item':
        return (
          <div>
            <p className="font-medium" style={{ color: config.rowFontColor, fontSize: `${config.rowFontSize}pt` }}>
              {item.description}
            </p>
            {item.detail && (
              <p className="text-xs" style={{ color: config.descriptionFontColor, fontSize: `${config.descriptionFontSize}pt` }}>
                {item.detail}
              </p>
            )}
            {item.unit && (
              <p className="text-xs" style={{ color: config.descriptionFontColor, fontSize: `${config.descriptionFontSize}pt` }}>
                {item.unit}
              </p>
            )}
          </div>
        );

      case 'quantity':
        const quantityCol = config.columns.find(col => col.id === 'quantity');
        return (
          <div>
            {item.qty?.toFixed(2)}
            {quantityCol?.showUnit && item.unit && (
              <span className="text-xs ml-1">({item.unit})</span>
            )}
          </div>
        );

      case 'rate':
        return `${currency} ${item.rate?.toFixed(2)}`;

      case 'taxableAmount':
        return `${currency} ${item.taxableAmount?.toFixed(2)}`;

      case 'vatRate':
        return item.vatPercent;

      case 'vatAmount':
        return item.vat?.toFixed(2);

      case 'discount':
        return item.discount?.toFixed(2);

      case 'amount':
        const amountCol = config.columns.find(col => col.id === 'amount');
        const displayAmount = amountCol?.addTaxToAmount
          ? (item.amount + item.vat)
          : item.amount;
        return `${currency} ${displayAmount?.toFixed(2)}`;

      case 'customFields':
        return item.custom || '-';

      default:
        return item[field] || '-';
    }
  };

  // Helper to determine text alignment
  const getTextAlignment = (columnId) => {
    const leftAlignedColumns = ['lineItemNumber', 'item', 'customFields'];
    return leftAlignedColumns.includes(columnId) ? 'left' : 'right';
  };

  return (
    <div className="">
      {/* Table Header */}
      <div
        className={`flex font-semibold rounded-t ${isSpreadsheet ? 'border border-gray-300' : ''}`}
        style={{
          backgroundColor: isSpreadsheet ? 'gray' : config.headerBackgroundColor,
          color: config.headerFontColor,
          fontSize: `${config.headerFontSize}pt`
        }}
      >
        {visibleColumns.map((column, index) => (
          <div
            key={column.id}
            className={`py-2 px-2 ${isSpreadsheet ? 'border-r border-gray-300 last:border-r-0' : ''}`}
            style={{
              width: `${column.width}%`,
              textAlign: getTextAlignment(column.id)
            }}
          >
            {column.label}
          </div>
        ))}
      </div>

      {/* Table Body */}
      {items.map((item, index) => (
        <div
          key={item.id || index}
          className={`flex ${isSpreadsheet ? 'border-x border-b border-gray-300' : 'border-b border-gray-200'}`}
          style={{
            backgroundColor: config.rowBackgroundColor,
            fontSize: `${config.rowFontSize}pt`
          }}
        >
          {visibleColumns.map((column, colIndex) => (
            <div
              key={column.id}
              className={`py-2 px-2 ${isSpreadsheet ? 'border-r border-gray-300 last:border-r-0' : ''}`}
              style={{
                width: `${column.width}%`,
                textAlign: getTextAlignment(column.id),
                color: config.rowFontColor
              }}
            >
              {renderCellContent(column, item, index)}
            </div>
          ))}
        </div>
      ))}

      {/* Totals */}
      {isSpreadsheet ? (
        <div className={`flex ${isSpreadsheet ? 'border-x border-b border-gray-300' : 'border-b border-gray-200'}`}>
          {visibleColumns.map((column, index) => {
            if (column.id === 'taxableAmount') {
              return (
                <div key={column.id} className={`py-2 px-2 text-right border-r border-gray-300`} style={{ width: `${column.width}%` }}>
                  <span className="text-sm font-semibold">Sub Total {currency} {subTotal.toFixed(2)}</span>
                </div>
              );
            } else if (column.id === 'vatAmount') {
              return (
                <div key={column.id} className={`py-2 px-2 text-right border-r border-gray-300`} style={{ width: `${column.width}%` }}>
                  <span className="text-sm">{currency} {vatAmount.toFixed(2)}</span>
                </div>
              );
            } else if (column.id === 'amount') {
              return (
                <div key={column.id} className={`py-2 px-2 text-right font-semibold`} style={{ width: `${column.width}%` }}>
                  <span className="text-sm font-semibold">{currency} {total.toFixed(2)}</span>
                </div>
              );
            } else {
              return <div key={column.id} className={`py-2 px-2`} style={{ width: `${column.width}%` }}></div>;
            }
          })}
        </div>
      ) : (
        totalsConfig.showTotalSection && (
          <div className="flex justify-end mt-4">
            <div className="w-full sm:w-2/5 md:w-1/3 text-right">
              {/* Sub Total */}
              {totalsConfig.subTotal.visible && (
                <div
                  className="flex justify-between py-2 px-4"
                  style={{
                    fontSize: `${totalsConfig.totalSectionFontSize}pt`,
                    color: totalsConfig.totalSectionFontColor,
                    backgroundColor: totalsConfig.totalSectionBgEnabled ? totalsConfig.totalSectionBgColor : 'transparent'
                  }}
                >
                  <span>{totalsConfig.subTotal.label}</span>
                  <span className="font-semibold">{formatCurrency(subTotal)}</span>
                </div>
              )}

              {/* Discount */}
              {totalsConfig.discount.visible && discount > 0 && (
                <div
                  className="flex justify-between py-2 px-4"
                  style={{
                    fontSize: `${totalsConfig.totalSectionFontSize}pt`,
                    color: totalsConfig.totalSectionFontColor,
                    backgroundColor: totalsConfig.totalSectionBgEnabled ? totalsConfig.totalSectionBgColor : 'transparent'
                  }}
                >
                  <span>{totalsConfig.discount.label}</span>
                  <span className="font-semibold">{formatCurrency(discount)}</span>
                </div>
              )}

              {/* Tax Details */}
              {totalsConfig.taxDetails.visible && vatAmount > 0 && (
                <div
                  className="flex justify-between py-2 px-4"
                  style={{
                    fontSize: `${totalsConfig.totalSectionFontSize}pt`,
                    color: totalsConfig.totalSectionFontColor,
                    backgroundColor: totalsConfig.totalSectionBgEnabled ? totalsConfig.totalSectionBgColor : 'transparent'
                  }}
                >
                  <span>{totalsConfig.taxDetails.label}</span>
                  <span className="font-semibold">{formatCurrency(vatAmount)}</span>
                </div>
              )}

              {/* Total */}
              {totalsConfig.total.visible && (
                <div
                  className="flex justify-between py-2 px-4 font-bold rounded-b"
                  style={{
                    fontSize: `${totalsConfig.totalSectionFontSize}pt`,
                    color: totalsConfig.totalSectionFontColor,
                    backgroundColor: totalsConfig.totalSectionBgEnabled ? totalsConfig.totalSectionBgColor : 'transparent'
                  }}
                >
                  <span>{totalsConfig.total.label}</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default PdfTable;
