### Non-BC Tests

class/class/remove-abstract
class/constructor/add-constructor
class/constructor/add-constructor-params-initializer
class/constructor/add-param-rest
class/constructor/change-param-name
class/getter/remove-getter-private
class/method/add-param-optional
class/method/add-param-secondplace-optional
class/method/private-to-public
class/setter/remove-setter-private
enum/add-initializer
enum/add-member
enum/initializer-string-to-number
enum/remove-initializer
export-declaration/change-named-to-namespace
export-declaration/remove-type
function/change-param-name
function/change-param-none-to-dotdotdot
interface/add-member-optional
interface/make-member-optional
type-alias/add-alias
types/build/array-type-to-object
types/build/parenthesized-type-to-any
types/constructor/indexed-number-to-number
types/constructor/literal-to-string
types/constructor/number-to-any
types/constructor/string-to-unknown
types/constructor/undefined-to-void
types/function/make-param-optional
types/function/add-param-optional
types/intersection/remove-intersection
types/intersection/add-intersection-any
types/intersection/add-intersection-same-type
types/intersection/add-intersection-number-on-literal
types/intersection/add-intersection-number-on-literal-array
types/intersection/add-intersection-object-on-array
types/tuple/remove-tuple-type-to-any
types/type-literal/add-index-sig
types/type-literal/change-to-object
types/type-literal/index-sig-number-to-index-sig-string
types/type-literal/index-sig-template-literal-to-index-sig-string
types/type-literal/indexed-sig-number-val-string-to-string
types/type-literal/make-property-sig-optional
types/type-literal/mapped-type-to-index-sig-string
types/union-type/add-union
types/union-type/remove-union-to-any
types/union-type/remove-union-to-number
types/union-type/remove-union-to-object

### Correct BC Tests

class/class/add-abstract
class/class/add-declare
class/class/add-default
class/class/remove-class
class/class/remove-declare
class/class/remove-export
class/constructor/add-constructor-params-none
class/constructor/add-param-none
class/getter/change-getter-return
class/getter/public-to-private
class/getter/remove-getter-protected
class/getter/remove-getter-public
class/method/add-abstract
class/method/add-param-firstplace-optional
class/method/add-param-none
class/method/add-static
class/method/public-to-private
class/method/remove-abstract
class/method/remove-param
class/method/remove-protected-method
class/method/remove-static
class/property/add-abstract
class/property/add-static
class/property/public-to-private
class/property/remove-declare
class/property/remove-property
class/property/remove-property-public
class/property/remove-static
class/setter/remove-setter-protected
class/setter/remove-setter-public
enum/change-name
enum/remove-export
enum/remove-member
export-assignment/change-expression
export-assignment/change-type-export
export-assignment/remove-export-assignment
export-declaration/add-alias
export-declaration/remove-alias
export-declaration/remove-named-export
export-declaration/remove-namespace-export
export-declaration/remove-specifier
function/add-async
function/add-default
function/change-param-dotdotdot-to-none
function/change-param-initializer-to-none
function/change-param-question-to-none
function/change-return-type
function/remove-export
function/remove-function
function/remove-param-none
interface/add-default
interface/add-member-required
interface/change-member-name
interface/make-member-required
interface/remove-export
interface/remove-member
playground
type-alias/remove-alias
types/array/add-array
types/array/remove-array-from-number-array
types/build/tuple-type-to-array-type-different
types/constructor/indexed-number-to-string
types/constructor/literal-to-string-bc
types/constructor/string-to-number
types/function/add-function-type
types/function/add-param-required
types/function/make-param-required
types/function/remove-param
types/intersection/add-intersection
types/tuple/add-item
types/tuple/add-tuple-type
types/tuple/remove-item
types/tuple/remove-tuple-type
types/type-literal/add-mapped-type
types/type-literal/add-property-sig
types/type-literal/index-sig-string-to-index-sig-number
types/type-literal/index-sig-string-to-index-sig-template-literal
types/type-literal/make-property-sig-required
types/type-reference/add-promise
types/type-reference/remove-promise
types/union-type/remove-union
variable/remove-declaration
variable/remove-variable
