const KTUsersList = (function () {
  // Define shared variables
  const table = document.getElementById('kt_table_users');
  let datatable;
  let toolbarBase;
  let toolbarSelected;
  let selectedCount;

  // Private functions
  const initUserTable = function () {
    // Set date data order
    const tableRows = table.querySelectorAll('tbody tr');

    // tableRows.forEach((row) => {
    //   const dateRow = row.querySelectorAll('td');
    //   const lastLogin = dateRow[3].innerText.toLowerCase(); // Get last login time
    //   let timeCount = 0;
    //   let timeFormat = 'minutes';

    //   // Determine date & time format -- add more formats when necessary
    //   if (lastLogin.includes('yesterday')) {
    //     timeCount = 1;
    //     timeFormat = 'days';
    //   } else if (lastLogin.includes('mins')) {
    //     timeCount = parseInt(lastLogin.replace(/\D/g, ''));
    //     timeFormat = 'minutes';
    //   } else if (lastLogin.includes('hours')) {
    //     timeCount = parseInt(lastLogin.replace(/\D/g, ''));
    //     timeFormat = 'hours';
    //   } else if (lastLogin.includes('days')) {
    //     timeCount = parseInt(lastLogin.replace(/\D/g, ''));
    //     timeFormat = 'days';
    //   } else if (lastLogin.includes('weeks')) {
    //     timeCount = parseInt(lastLogin.replace(/\D/g, ''));
    //     timeFormat = 'weeks';
    //   }

    //   // Subtract date/time from today -- more info on moment datetime subtraction: https://momentjs.com/docs/#/durations/subtract/
    //   const realDate = moment().subtract(timeCount, timeFormat).format();

    //   // Insert real date to last login attribute
    //   dateRow[3].setAttribute('data-order', realDate);

    //   // Set real date for joined column
    //   const joinedDate = moment(dateRow[5].innerHTML, 'DD MMM YYYY, LT').format(); // select date from 5th column in table
    //   dateRow[5].setAttribute('data-order', joinedDate);
    // });

    // Init datatable --- more info on datatables: https://datatables.net/manual/
    datatable = $(table).DataTable({
      processing: true, // Feature control the processing indicator.
      serverSide: true, // Feature control DataTables' server-side processing mode.
      info: false,
      order: [],
      pageLength: 10,
      lengthChange: false,
	  responsive: true,
      //   deferLoading: 1,
      ajax: {
        url: 'http://localhost:8100/blogs/fetch',
        // beforeSend	: function(xhr){
        // 	xhr.setRequestHeader("X-CSRF-TOKEN", $('meta[name="csrf-token"]').attr('content'));
        // },
        type: 'POST',
        // dataType: 'json',
        dataSrc: 'data',
        // data: { aa: 333, bb: 444 },
        data(d) {
          console.log(d);
          // d.filter = 8383838383838;
          // return d;
          const postFilter = {};
          // console.log($('.ave-filter'));
          $.each($('.ave-filter'), (x, y) => {
            if ($(y).attr('name') && $(y).val() != '') {
              const name = $(y).attr('name');
              const value = name.includes(':ilike') ? `%${$(y).val()}%` : $(y).val();
              postFilter[name] = value;
            }
          });
		  console.log(postFilter);
          d.filter = postFilter;
          console.log(22222);
          console.log(d);
          return d;
        },
      },
      fnServerParams(data) {
        // console.log(data);
      },
      columns: [
        {
          data: 'id',
        },
        {
          data: 'image_url',
        },
      ],
    //   columnDefs: [
    //     { orderable: false, targets: 0 }, // Disable ordering on column 0 (checkbox)
    //     { orderable: false, targets: 6 }, // Disable ordering on column 6 (actions)
    //   ],
    });

    // Re-init functions on every table re-draw -- more info: https://datatables.net/reference/event/draw
    datatable.on('draw', () => {
      initToggleToolbar();
      handleDeleteRows();
      toggleToolbars();
    });
  };

  // Search Datatable --- official docs reference: https://datatables.net/reference/api/search()
  const handleSearchDatatable = () => {
    const filterSearch = document.querySelector('[data-kt-user-table-filter="search"]');
    filterSearch.addEventListener('keyup', (e) => {
      datatable.search(e.target.value).draw();
    });
  };

  // Filter Datatable
  const handleFilterDatatable = () => {
    // Select filter options
    // console.log($('[data-kt-user-table-filter="form"] :input'));
    const filterForm = document.querySelector('[data-kt-user-table-filter="form"]');
    const filterButton = filterForm.querySelector('[data-kt-user-table-filter="filter"]');
    // const selectOptions = filterForm.querySelectorAll('select');

    // Filter datatable on submit
    console.log(1);
    filterButton.addEventListener('click', () => {
    //   let filterString = '';

      // Get filter values
      //   selectOptions.forEach((item, index) => {
      //     if (item.value && item.value !== '') {
      //       if (index !== 0) {
      //         filterString += ' ';
      //       }

      //       // Build filter value options
      //       filterString += item.value;
      //     }
      //   });
      console.log(2);
	  datatable.draw();
      // Filter datatable --- official docs reference: https://datatables.net/reference/api/search()
    //   datatable.search(filterString).draw();
    });
  };

  // Reset Filter
  const handleResetForm = () => {
    // Select reset button
    const resetButton = document.querySelector('[data-kt-user-table-filter="reset"]');

    // Reset datatable
    resetButton.addEventListener('click', () => {
      // Select filter options
      const filterForm = document.querySelector('[data-kt-user-table-filter="form"]');
      const selectOptions = filterForm.querySelectorAll('select');

      // Reset select2 values -- more info: https://select2.org/programmatic-control/add-select-clear-items
      selectOptions.forEach((select) => {
        $(select).val('').trigger('change');
      });

      // Reset datatable --- official docs reference: https://datatables.net/reference/api/search()
      datatable.search('').draw();
    });
  };

  // Delete subscirption
  var handleDeleteRows = () => {
    // Select all delete buttons
    const deleteButtons = table.querySelectorAll('[data-kt-users-table-filter="delete_row"]');

    deleteButtons.forEach((d) => {
      // Delete button on click
      d.addEventListener('click', (e) => {
        e.preventDefault();

        // Select parent row
        const parent = e.target.closest('tr');

        // Get user name
        const userName = parent.querySelectorAll('td')[1].querySelectorAll('a')[1].innerText;

        // SweetAlert2 pop up --- official docs reference: https://sweetalert2.github.io/
        Swal.fire({
          text: `Are you sure you want to delete ${userName}?`,
          icon: 'warning',
          showCancelButton: true,
          buttonsStyling: false,
          confirmButtonText: 'Yes, delete!',
          cancelButtonText: 'No, cancel',
          customClass: {
            confirmButton: 'btn fw-bold btn-danger',
            cancelButton: 'btn fw-bold btn-active-light-primary',
          },
        }).then((result) => {
          if (result.value) {
            Swal.fire({
              text: `You have deleted ${userName}!.`,
              icon: 'success',
              buttonsStyling: false,
              confirmButtonText: 'Ok, got it!',
              customClass: {
                confirmButton: 'btn fw-bold btn-primary',
              },
            }).then(() => {
              // Remove current row
              datatable.row($(parent)).remove().draw();
            }).then(() => {
              // Detect checked checkboxes
              toggleToolbars();
            });
          } else if (result.dismiss === 'cancel') {
            Swal.fire({
              text: `${customerName} was not deleted.`,
              icon: 'error',
              buttonsStyling: false,
              confirmButtonText: 'Ok, got it!',
              customClass: {
                confirmButton: 'btn fw-bold btn-primary',
              },
            });
          }
        });
      });
    });
  };

  // Init toggle toolbar
  var initToggleToolbar = () => {
    // Toggle selected action toolbar
    // Select all checkboxes
    const checkboxes = table.querySelectorAll('[type="checkbox"]');

    // Select elements
    toolbarBase = document.querySelector('[data-kt-user-table-toolbar="base"]');
    toolbarSelected = document.querySelector('[data-kt-user-table-toolbar="selected"]');
    selectedCount = document.querySelector('[data-kt-user-table-select="selected_count"]');
    const deleteSelected = document.querySelector('[data-kt-user-table-select="delete_selected"]');

    // Toggle delete selected toolbar
    checkboxes.forEach((c) => {
      // Checkbox on click event
      c.addEventListener('click', () => {
        setTimeout(() => {
          toggleToolbars();
        }, 50);
      });
    });

    // Deleted selected rows
    deleteSelected.addEventListener('click', () => {
      // SweetAlert2 pop up --- official docs reference: https://sweetalert2.github.io/
      Swal.fire({
        text: 'Are you sure you want to delete selected customers?',
        icon: 'warning',
        showCancelButton: true,
        buttonsStyling: false,
        confirmButtonText: 'Yes, delete!',
        cancelButtonText: 'No, cancel',
        customClass: {
          confirmButton: 'btn fw-bold btn-danger',
          cancelButton: 'btn fw-bold btn-active-light-primary',
        },
      }).then((result) => {
        if (result.value) {
          Swal.fire({
            text: 'You have deleted all selected customers!.',
            icon: 'success',
            buttonsStyling: false,
            confirmButtonText: 'Ok, got it!',
            customClass: {
              confirmButton: 'btn fw-bold btn-primary',
            },
          }).then(() => {
            // Remove all selected customers
            checkboxes.forEach((c) => {
              if (c.checked) {
                datatable.row($(c.closest('tbody tr'))).remove().draw();
              }
            });

            // Remove header checked box
            const headerCheckbox = table.querySelectorAll('[type="checkbox"]')[0];
            headerCheckbox.checked = false;
          }).then(() => {
            toggleToolbars(); // Detect checked checkboxes
            initToggleToolbar(); // Re-init toolbar to recalculate checkboxes
          });
        } else if (result.dismiss === 'cancel') {
          Swal.fire({
            text: 'Selected customers was not deleted.',
            icon: 'error',
            buttonsStyling: false,
            confirmButtonText: 'Ok, got it!',
            customClass: {
              confirmButton: 'btn fw-bold btn-primary',
            },
          });
        }
      });
    });
  };

  // Toggle toolbars
  const toggleToolbars = () => {
    // Select refreshed checkbox DOM elements
    const allCheckboxes = table.querySelectorAll('tbody [type="checkbox"]');

    // Detect checkboxes state & count
    let checkedState = false;
    let count = 0;

    // Count checked boxes
    allCheckboxes.forEach((c) => {
      if (c.checked) {
        checkedState = true;
        count++;
      }
    });

    // Toggle toolbars
    if (checkedState) {
      selectedCount.innerHTML = count;
      toolbarBase.classList.add('d-none');
      toolbarSelected.classList.remove('d-none');
    } else {
      toolbarBase.classList.remove('d-none');
      toolbarSelected.classList.add('d-none');
    }
  };

  return {
    // Public functions
    init() {
      if (!table) {
        return;
      }

      initUserTable();
      initToggleToolbar();
      handleSearchDatatable();
      handleResetForm();
      handleDeleteRows();
      handleFilterDatatable();
    },
  };
}());

// On document ready
KTUtil.onDOMContentLoaded(() => {
  KTUsersList.init();
});
